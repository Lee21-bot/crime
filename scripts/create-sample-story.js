const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createSampleStory() {
  try {
    console.log('Creating sample audio story...')

    const sampleStory = {
      title: 'The Disappearance of Sarah Mitchell',
      description: 'A mysterious case from Portland where a young woman vanished without a trace, leaving investigators baffled for over three years. This exclusive audio story delves into the investigation, witness accounts, and the theories that emerged.',
      content: `In the quiet suburbs of Portland, Oregon, Sarah Mitchell was a 24-year-old graduate student who seemed to have everything going for her. She was studying psychology at Portland State University, had a close-knit group of friends, and was planning her future with her boyfriend of two years.

On the evening of March 15th, 2021, Sarah left her apartment to meet friends for dinner at a local restaurant. She was last seen at 7:30 PM, walking to her car in the parking lot. Her phone pinged one last time at 7:45 PM, and then she vanished without a trace.

The investigation began immediately. Sarah's car was found abandoned in a shopping center parking lot three miles from the restaurant. Her purse, phone, and keys were still inside the vehicle. There were no signs of a struggle, no blood, no forced entry.

Detectives interviewed over 50 witnesses, including her boyfriend, family members, friends, and coworkers. Everyone described Sarah as a happy, well-adjusted young woman with no known enemies or personal problems. Her bank accounts showed no unusual activity, and her social media accounts went silent.

The case went cold for months until a breakthrough came from an unexpected source. A local business owner reported seeing a woman matching Sarah's description at a gas station 50 miles from Portland on the night of her disappearance. The surveillance footage was grainy, but investigators believed it could be Sarah.

This lead opened up new possibilities. Was Sarah still alive? Had she left voluntarily? Or was someone holding her against her will? The investigation continues to this day, with new leads emerging periodically.

Sarah's family has never given up hope. They maintain a website dedicated to finding her and have offered a substantial reward for information leading to her whereabouts. The case has become one of Portland's most baffling mysteries, leaving investigators and the community searching for answers.

This audio story explores the investigation in detail, examining the evidence, the theories, and the impact this case has had on the community. We'll hear from investigators, family members, and experts who have studied similar cases.`,
      audio_url: 'https://example.com/sample-audio.mp3', // Placeholder URL
      duration_seconds: 1800, // 30 minutes
      voice_type: 'NARRATOR',
      status: 'published',
      author: 'True Crime Community',
      tags: ['missing person', 'portland', 'mystery', 'cold case'],
      is_featured: true,
      play_count: 0
    }

    console.log('Sample story data:', JSON.stringify(sampleStory, null, 2))

    const { data, error } = await supabase
      .from('audio_stories')
      .insert(sampleStory)
      .select()

    if (error) {
      console.error('Error creating sample story:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return
    }

    console.log('Sample audio story created successfully!')
    console.log('Story ID:', data[0].id)
    console.log('Title:', data[0].title)
    console.log('Status:', data[0].status)

  } catch (error) {
    console.error('Error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
  }
}

createSampleStory() 