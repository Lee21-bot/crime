-- Audio Stories Schema Migration
-- This migration creates the audio_stories and audio_story_plays tables

-- Audio Stories table
CREATE TABLE IF NOT EXISTS audio_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL, -- The text content that was narrated
  audio_url TEXT NOT NULL, -- URL to the generated audio file
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  voice_type TEXT NOT NULL DEFAULT 'NARRATOR',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author TEXT,
  tags TEXT[], -- Array of tags for categorization
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  play_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audio_stories_status ON audio_stories(status);
CREATE INDEX IF NOT EXISTS idx_audio_stories_voice_type ON audio_stories(voice_type);
CREATE INDEX IF NOT EXISTS idx_audio_stories_created_at ON audio_stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audio_stories_tags ON audio_stories USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_audio_stories_featured ON audio_stories(is_featured) WHERE is_featured = TRUE;

-- Enable Row Level Security
ALTER TABLE audio_stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admins can do everything
CREATE POLICY "Admins can manage all audio stories" ON audio_stories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.is_admin = TRUE
    )
  );

-- Published stories are visible to investigators
CREATE POLICY "Investigators can view published audio stories" ON audio_stories
  FOR SELECT USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.membership_tier = 'investigator'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_audio_stories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_audio_stories_updated_at
  BEFORE UPDATE ON audio_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_audio_stories_updated_at();

-- Function to set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_audio_stories_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set published_at
CREATE TRIGGER set_audio_stories_published_at
  BEFORE UPDATE ON audio_stories
  FOR EACH ROW
  EXECUTE FUNCTION set_audio_stories_published_at();

-- Audio Story Play History (optional - for analytics)
CREATE TABLE IF NOT EXISTS audio_story_plays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES audio_stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_played INTEGER, -- How many seconds were played
  completed BOOLEAN DEFAULT FALSE
);

-- Indexes for play history
CREATE INDEX IF NOT EXISTS idx_audio_story_plays_story_id ON audio_story_plays(story_id);
CREATE INDEX IF NOT EXISTS idx_audio_story_plays_user_id ON audio_story_plays(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_story_plays_played_at ON audio_story_plays(played_at DESC);

-- Enable RLS for play history
ALTER TABLE audio_story_plays ENABLE ROW LEVEL SECURITY;

-- Users can only see their own play history
CREATE POLICY "Users can view their own play history" ON audio_story_plays
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own play records
CREATE POLICY "Users can insert their own play records" ON audio_story_plays
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can view all play history
CREATE POLICY "Admins can view all play history" ON audio_story_plays
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.is_admin = TRUE
    )
  ); 