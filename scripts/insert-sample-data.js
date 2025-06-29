const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function insertSampleData() {
  console.log('Inserting sample data...')

  try {
    // Insert sample tags
    console.log('Inserting sample tags...')
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .insert([
        { name: 'Unsolved' },
        { name: 'Serial Killer' },
        { name: 'Missing Person' },
        { name: 'Cold Case' },
        { name: 'Forensic Evidence' },
        { name: 'Conspiracy' },
        { name: 'Historical' },
        { name: 'Modern Era' }
      ])
      .select()

    if (tagsError) {
      console.error('Error inserting tags:', tagsError)
    } else {
      console.log('✅ Sample tags inserted:', tags.length)
    }

    // Insert sample case files
    console.log('Inserting sample case files...')
    const { data: cases, error: casesError } = await supabase
      .from('case_files')
      .insert([
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
      ])
      .select()

    if (casesError) {
      console.error('Error inserting case files:', casesError)
    } else {
      console.log('✅ Sample case files inserted:', cases.length)
    }

    console.log('🎉 Sample data insertion completed!')

  } catch (error) {
    console.error('Sample data insertion failed:', error)
  }
}

insertSampleData() 