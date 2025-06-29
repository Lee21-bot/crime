-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Case Files Table
CREATE TABLE IF NOT EXISTS case_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  required_tier TEXT NOT NULL CHECK (required_tier IN ('free', 'investigator')),
  featured_image_url TEXT,
  audio_url TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Case Files Tags Junction Table
CREATE TABLE IF NOT EXISTS case_files_tags (
  case_file_id UUID REFERENCES case_files(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (case_file_id, tag_id)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS case_file_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_file_id UUID REFERENCES case_files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated At Triggers
CREATE TRIGGER update_case_files_updated_at
  BEFORE UPDATE ON case_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_file_comments_updated_at
  BEFORE UPDATE ON case_file_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE case_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_files_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_file_comments ENABLE ROW LEVEL SECURITY;

-- Case Files Policies
CREATE POLICY "Case files are viewable by everyone"
ON case_files FOR SELECT
TO authenticated, anon
USING (published = true);

CREATE POLICY "Only investigators can create case files"
ON case_files FOR INSERT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'investigator'
  )
);

CREATE POLICY "Only investigators can update their own case files"
ON case_files FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'investigator'
  )
  AND author_id = auth.uid()
);

-- Tags Policies
CREATE POLICY "Tags are viewable by everyone"
ON tags FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Only investigators can create tags"
ON tags FOR INSERT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'investigator'
  )
);

-- Case Files Tags Policies
CREATE POLICY "Case file tags are viewable by everyone"
ON case_files_tags FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Only investigators can manage case file tags"
ON case_files_tags FOR INSERT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'investigator'
  )
);

CREATE POLICY "Only investigators can delete case file tags"
ON case_files_tags FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'investigator'
  )
);

-- Comments Policies
CREATE POLICY "Comments on accessible case files are viewable by everyone"
ON case_file_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM case_files
    WHERE id = case_file_id
    AND published = true
    AND (
      required_tier = 'free'
      OR (
        required_tier = 'investigator'
        AND auth.role() = 'authenticated'
        AND (SELECT is_investigator FROM auth.users WHERE id = auth.uid())
      )
    )
  )
);

CREATE POLICY "Authenticated users can create comments"
ON case_file_comments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM case_files
    WHERE id = case_file_id
    AND published = true
    AND (
      required_tier = 'free'
      OR (
        required_tier = 'investigator'
        AND (SELECT is_investigator FROM auth.users WHERE id = auth.uid())
      )
    )
  )
);

CREATE POLICY "Users can update their own comments"
ON case_file_comments FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
ON case_file_comments FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_case_files_slug ON case_files(slug);
CREATE INDEX IF NOT EXISTS idx_case_files_author_id ON case_files(author_id);
CREATE INDEX IF NOT EXISTS idx_case_files_status ON case_files(status);
CREATE INDEX IF NOT EXISTS idx_case_files_published ON case_files(published);
CREATE INDEX IF NOT EXISTS idx_case_files_created_at ON case_files(created_at DESC);
CREATE INDEX IF NOT EXISTS case_file_comments_case_file_id_idx ON case_file_comments(case_file_id);
CREATE INDEX IF NOT EXISTS case_file_comments_user_id_idx ON case_file_comments(user_id);
CREATE INDEX IF NOT EXISTS case_files_tags_case_file_id_idx ON case_files_tags(case_file_id);
CREATE INDEX IF NOT EXISTS case_files_tags_tag_id_idx ON case_files_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_case_files_tags_case_file_id ON case_files_tags(case_file_id);
CREATE INDEX IF NOT EXISTS idx_case_files_tags_tag_id ON case_files_tags(tag_id); 