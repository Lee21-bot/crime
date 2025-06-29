'use server'

import { createClient } from '../supabase/server'

export async function setupDatabase() {
  const supabase = await createClient()
  
  try {
    // Create tables using the schema
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })

    if (schemaError) {
      console.error('Error creating schema:', schemaError)
      return { success: false, error: schemaError }
    }

    // Insert sample tags
    const { error: tagsError } = await supabase
      .from('tags')
      .upsert([
        { name: 'Unsolved' },
        { name: 'Serial Killer' },
        { name: 'Missing Person' },
        { name: 'Cold Case' },
        { name: 'Forensic Evidence' },
        { name: 'Conspiracy' },
        { name: 'Historical' },
        { name: 'Modern Era' }
      ], { onConflict: 'name' })

    if (tagsError) {
      console.error('Error inserting tags:', tagsError)
      return { success: false, error: tagsError }
    }

    // Insert sample case files
    const { data: users } = await supabase.auth.getUser()
    const authorId = users.user?.id || '00000000-0000-0000-0000-000000000000'

    const { error: casesError } = await supabase
      .from('case_files')
      .upsert([
        {
          title: 'The Disappearance of Amelia Earhart',
          slug: 'amelia-earhart-disappearance',
          summary: 'The mysterious vanishing of aviation pioneer Amelia Earhart during her 1937 attempt to circumnavigate the globe.',
          content: `# The Disappearance of Amelia Earhart

On July 2, 1937, aviation pioneer Amelia Earhart and her navigator Fred Noonan vanished while attempting to fly around the world. Their Lockheed Electra 10E disappeared somewhere over the Pacific Ocean near Howland Island.

## The Flight

Earhart's journey began on March 17, 1937, from Oakland, California. She successfully completed most of the journey, flying eastward across the globe. The final leg was from Lae, New Guinea to Howland Island, a distance of 2,556 miles.

## The Last Transmission

The last confirmed radio transmission from Earhart was at 8:43 AM on July 2, 1937:
"I am on a line of position 157-337. I will repeat this message. I will repeat this on 6210 kilocycles. Wait."

## Theories

1. **Crash and Sink Theory**: The most widely accepted theory is that Earhart and Noonan ran out of fuel and crashed into the ocean.

2. **Gardner Island Theory**: Some believe they landed on Gardner Island (now Nikumaroro) and survived for a time.

3. **Japanese Capture Theory**: A controversial theory suggests they were captured by Japanese forces.

## Evidence

- Radio transmissions were heard for several days after their disappearance
- A distress call was allegedly heard on 3105 kHz
- Various artifacts have been found on Pacific islands
- Recent expeditions have searched the ocean floor

## Legacy

Amelia Earhart's disappearance remains one of aviation's greatest mysteries, inspiring countless searches and theories over the decades.`,
          difficulty_level: 'intermediate',
          required_tier: 'free',
          author_id: authorId,
          status: 'published',
          published: true
        },
        {
          title: 'The Zodiac Killer',
          slug: 'zodiac-killer',
          summary: 'The unidentified serial killer who terrorized Northern California in the late 1960s and early 1970s.',
          content: `# The Zodiac Killer

The Zodiac Killer was an unidentified serial killer who operated in Northern California from at least December 1968 to October 1969. The killer sent taunting letters and cryptograms to police and newspapers.

## Known Victims

1. **David Faraday and Betty Lou Jensen** (December 20, 1968)
2. **Michael Mageau and Darlene Ferrin** (July 4, 1969)
3. **Bryan Hartnell and Cecelia Shepard** (September 27, 1969)
4. **Paul Stine** (October 11, 1969)

## The Letters

The Zodiac sent numerous letters to newspapers and police, often including cryptograms. Some of these remain unsolved to this day.

## Cryptograms

The killer sent several cryptograms:
- The 408-character cipher (solved)
- The 340-character cipher (solved in 2020)
- The 13-character cipher (unsolved)
- The 17-character cipher (unsolved)

## Suspects

Over the years, numerous suspects have been investigated:
- Arthur Leigh Allen
- Richard Gaikowski
- Lawrence Kane
- And many others

## Recent Developments

In 2020, a team of codebreakers solved the 340-character cipher, but it provided no new information about the killer's identity.

## Legacy

The Zodiac case remains one of America's most infamous unsolved serial killer cases, inspiring books, movies, and ongoing investigations.`,
          difficulty_level: 'advanced',
          required_tier: 'investigator',
          author_id: authorId,
          status: 'published',
          published: true
        }
      ], { onConflict: 'slug' })

    if (casesError) {
      console.error('Error inserting case files:', casesError)
      return { success: false, error: casesError }
    }

    // Link case files to tags
    const { data: caseFiles } = await supabase
      .from('case_files')
      .select('id, slug')

    const { data: tags } = await supabase
      .from('tags')
      .select('id, name')

    if (caseFiles && tags) {
      const tagMappings = [
        { caseSlug: 'amelia-earhart-disappearance', tagNames: ['Missing Person', 'Historical', 'Cold Case'] },
        { caseSlug: 'zodiac-killer', tagNames: ['Serial Killer', 'Unsolved', 'Forensic Evidence'] }
      ]

      for (const mapping of tagMappings) {
        const caseFile = caseFiles.find(c => c.slug === mapping.caseSlug)
        const caseTags = tags.filter(t => mapping.tagNames.includes(t.name))

        for (const tag of caseTags) {
          await supabase
            .from('case_files_tags')
            .upsert({
              case_file_id: caseFile?.id,
              tag_id: tag.id
            }, { onConflict: 'case_file_id,tag_id' })
        }
      }
    }

    console.log('Database setup completed successfully!')
    return { success: true }

  } catch (error) {
    console.error('Database setup failed:', error)
    return { success: false, error }
  }
} 