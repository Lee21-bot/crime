-- Setup storage policies for episode-files bucket
-- Run this in your Supabase SQL editor

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Public can read episode files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;

-- Policy for admin uploads
CREATE POLICY "Admins can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'episode-files' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.is_admin = true
  )
);

-- Policy for public reads
CREATE POLICY "Public can read episode files" ON storage.objects
FOR SELECT USING (bucket_id = 'episode-files');

-- Policy for admin updates
CREATE POLICY "Admins can update files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'episode-files' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.is_admin = true
  )
);

-- Policy for admin deletes
CREATE POLICY "Admins can delete files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'episode-files' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.is_admin = true
  )
); 