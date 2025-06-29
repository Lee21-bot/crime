-- Migration: Add sources, status, and scheduled_at to audio_stories
ALTER TABLE audio_stories ADD COLUMN IF NOT EXISTS sources TEXT;
ALTER TABLE audio_stories ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published'));
ALTER TABLE audio_stories ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE; 