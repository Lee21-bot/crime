'use client'

import { AudioGenerator } from '../../components/audio/audio-generator'

const testText = `
The mysterious disappearance of Sarah Mitchell has baffled investigators for over three years. 
On the evening of March 15th, 2021, Sarah was last seen leaving her apartment building in downtown 
Portland. Witnesses reported seeing her walking toward the local coffee shop, but she never arrived.

The investigation revealed several puzzling details. Sarah's phone was found in her apartment, 
fully charged and showing no unusual activity. Her car remained in the parking garage, and her 
wallet and keys were discovered in her purse on the kitchen counter. It was as if she had simply 
vanished into thin air.

Detective James Rodriguez, the lead investigator on the case, described the situation as "one of 
the most perplexing cases of my career." Despite extensive searches, interviews with over 200 
witnesses, and analysis of surveillance footage from surrounding businesses, no trace of Sarah 
has been found.

The case has generated significant media attention and has become a focal point for missing 
persons advocacy groups. Sarah's family continues to hold out hope for answers, while the 
investigation remains active.
`

export default function TestAudioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Audio Generation Test</h1>
        <p className="text-gray-400 mb-8">
          This page tests the ElevenLabs audio generation functionality. 
          Try generating audio with different voices to see how it works.
        </p>
        
        <AudioGenerator
          text={testText}
          title="Test Case: The Disappearance of Sarah Mitchell"
          onAudioGenerated={(audioUrl) => {
            console.log('Audio generated successfully:', audioUrl)
          }}
        />
      </div>
    </div>
  )
} 