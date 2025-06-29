const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupStoragePolicies() {
  try {
    console.log('Setting up storage bucket and policies...')
    
    // First, let's check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
      return
    }
    
    console.log('Existing buckets:', buckets.map(b => b.name))
    
    const bucketName = 'episode-files'
    const bucketExists = buckets.some(b => b.name === bucketName)
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`)
      
      const { data: bucket, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['audio/*', 'image/*'],
        fileSizeLimit: 52428800 // 50MB
      })
      
      if (createError) {
        console.error('Error creating bucket:', createError)
        return
      }
      
      console.log('Bucket created:', bucket)
    } else {
      console.log(`Bucket ${bucketName} already exists`)
    }
    
    // Now let's set up the RLS policies
    console.log('Setting up RLS policies...')
    
    // Policy for admin uploads
    const uploadPolicy = `
      CREATE POLICY "Admins can upload files" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'episode-files' AND
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE user_profiles.user_id = auth.uid() 
          AND user_profiles.is_admin = true
        )
      );
    `
    
    // Policy for public reads
    const readPolicy = `
      CREATE POLICY "Public can read episode files" ON storage.objects
      FOR SELECT USING (bucket_id = 'episode-files');
    `
    
    // Policy for admin updates/deletes
    const updatePolicy = `
      CREATE POLICY "Admins can update files" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'episode-files' AND
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE user_profiles.user_id = auth.uid() 
          AND user_profiles.is_admin = true
        )
      );
    `
    
    const deletePolicy = `
      CREATE POLICY "Admins can delete files" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'episode-files' AND
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE user_profiles.user_id = auth.uid() 
          AND user_profiles.is_admin = true
        )
      );
    `
    
    // Execute the policies using the service role client
    const policies = [
      { name: 'upload', sql: uploadPolicy },
      { name: 'read', sql: readPolicy },
      { name: 'update', sql: updatePolicy },
      { name: 'delete', sql: deletePolicy }
    ]
    
    for (const policy of policies) {
      try {
        console.log(`Creating ${policy.name} policy...`)
        const { error } = await supabase.rpc('exec_sql', { sql: policy.sql })
        
        if (error) {
          console.log(`Policy ${policy.name} might already exist or failed:`, error.message)
        } else {
          console.log(`Policy ${policy.name} created successfully`)
        }
      } catch (err) {
        console.log(`Policy ${policy.name} error:`, err.message)
      }
    }
    
    console.log('Storage setup complete!')
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

setupStoragePolicies() 