const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  console.log('Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('Setting up database tables...')

  try {
    // Create case_files table
    const { error: caseFilesError } = await supabase
      .from('case_files')
      .select('*')
      .limit(1)

    if (caseFilesError && caseFilesError.code === '42P01') {
      console.log('Creating case_files table...')
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE case_files (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            summary TEXT NOT NULL,
            content TEXT NOT NULL,
            difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
            required_tier TEXT NOT NULL CHECK (required_tier IN ('free', 'investigator')),
            featured_image_url TEXT,
            audio_url TEXT,
            view_count INTEGER NOT NULL DEFAULT 0,
            author_id UUID NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
            published BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
        `
      })

      if (error) {
        console.error('Error creating case_files table:', error)
        return
      }
    }

    // Create tags table
    const { error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .limit(1)

    if (tagsError && tagsError.code === '42P01') {
      console.log('Creating tags table...')
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE tags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
        `
      })

      if (error) {
        console.error('Error creating tags table:', error)
        return
      }
    }

    // Create case_files_tags junction table
    const { error: junctionError } = await supabase
      .from('case_files_tags')
      .select('*')
      .limit(1)

    if (junctionError && junctionError.code === '42P01') {
      console.log('Creating case_files_tags table...')
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE case_files_tags (
            case_file_id UUID NOT NULL,
            tag_id UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            PRIMARY KEY (case_file_id, tag_id)
          );
        `
      })

      if (error) {
        console.error('Error creating case_files_tags table:', error)
        return
      }
    }

    // Create user_subscriptions table
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .limit(1)

    if (subscriptionError && subscriptionError.code === '42P01') {
      console.log('Creating user_subscriptions table...')
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE user_subscriptions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            stripe_customer_id TEXT,
            stripe_subscription_id TEXT,
            tier TEXT NOT NULL CHECK (tier IN ('free', 'investigator', 'detective')),
            status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'past_due', 'incomplete')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
        `
      })

      if (error) {
        console.error('Error creating user_subscriptions table:', error)
        return
      }
    }

    // Create user_profiles table
    const { error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)

    if (profileError && profileError.code === '42P01') {
      console.log('Creating user_profiles table...')
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE user_profiles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL UNIQUE,
            display_name TEXT NOT NULL,
            bio TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
        `
      })

      if (error) {
        console.error('Error creating user_profiles table:', error)
        return
      }

      // Enable RLS and add policies for user_profiles
      console.log('Setting up RLS policies for user_profiles...')
      const { error: rlsError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view their own profile"
          ON user_profiles FOR SELECT
          TO authenticated
          USING (user_id = auth.uid());
          
          CREATE POLICY "Users can insert their own profile"
          ON user_profiles FOR INSERT
          TO authenticated
          WITH CHECK (user_id = auth.uid());
          
          CREATE POLICY "Users can update their own profile"
          ON user_profiles FOR UPDATE
          TO authenticated
          USING (user_id = auth.uid())
          WITH CHECK (user_id = auth.uid());
        `
      })

      if (rlsError) {
        console.error('Error setting up RLS policies for user_profiles:', rlsError)
      } else {
        console.log('✅ RLS policies for user_profiles created')
      }
    }

    console.log('✅ Database tables created successfully')

    // Insert sample tags
    console.log('Inserting sample tags...')
    const { error: tagsInsertError } = await supabase
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

    if (tagsInsertError) {
      console.error('Error inserting tags:', tagsInsertError)
    } else {
      console.log('✅ Sample tags inserted')
    }

    // Insert sample case files
    console.log('Inserting sample case files...')
    const { error: casesInsertError } = await supabase
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
          author_id: '00000000-0000-0000-0000-000000000000', // Placeholder
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
          author_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          status: 'published',
          published: true
        }
      ], { onConflict: 'slug' })

    if (casesInsertError) {
      console.error('Error inserting case files:', casesInsertError)
    } else {
      console.log('✅ Sample case files inserted')
    }

    console.log('🎉 Database setup completed successfully!')

  } catch (error) {
    console.error('Database setup failed:', error)
  }
}

setupDatabase() 