-- Add color column to user_profiles table
-- Run this in your Supabase SQL editor

ALTER TABLE user_profiles 
ADD COLUMN color TEXT DEFAULT NULL;

-- Add a comment to explain the column
COMMENT ON COLUMN user_profiles.color IS 'User-chosen color for chat avatars and UI elements (hex color code)'; 