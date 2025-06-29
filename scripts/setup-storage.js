const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  try {
    console.log('Setting up Supabase storage...')

    // Create the episode-files bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('episode-files', {
      public: true,
      allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'image/png', 'image/jpeg', 'image/jpg'],
      fileSizeLimit: 52428800, // 50MB limit
    })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('Bucket already exists, skipping creation...')
      } else {
        throw bucketError
      }
    } else {
      console.log('✅ Created episode-files bucket')
    }

    // Set up storage policies
    console.log('Setting up storage policies...')

    // Policy for admins to upload files
    const { error: uploadPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'episode-files',
      policy_name: 'Allow admin uploads',
      policy_definition: `
        CREATE POLICY "Allow admin uploads" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (
          bucket_id = 'episode-files' AND
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.is_admin = true
          )
        )
      `
    })

    if (uploadPolicyError && !uploadPolicyError.message.includes('already exists')) {
      console.error('Upload policy error:', uploadPolicyError)
    } else {
      console.log('✅ Upload policy created')
    }

    // Policy for public read access
    const { error: readPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'episode-files',
      policy_name: 'Allow public reads',
      policy_definition: `
        CREATE POLICY "Allow public reads" ON storage.objects
        FOR SELECT TO public
        USING (bucket_id = 'episode-files')
      `
    })

    if (readPolicyError && !readPolicyError.message.includes('already exists')) {
      console.error('Read policy error:', readPolicyError)
    } else {
      console.log('✅ Read policy created')
    }

    console.log('✅ Storage setup complete!')
    console.log('You can now upload episode files through the admin interface.')

  } catch (error) {
    console.error('Storage setup error:', error)
    process.exit(1)
  }
}

setupStorage() 