import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowLeft, Volume2, Download, Eye, Users } from 'lucide-react'

// Mock case file data for D.B. Cooper (free tier)
const caseFileData = {
  id: 4,
  slug: 'db-cooper-1971',
  title: 'D.B. Cooper',
  subtitle: 'The Gentleman Skyjacker',
  summary: 'The only unsolved commercial aircraft hijacking in American history - a mysterious man who vanished into thin air.',
  content: `
## Case Overview

On November 24, 1971, a man identifying himself as Dan Cooper (later misreported as "D.B. Cooper") boarded Northwest Orient Flight 305, a Boeing 727 aircraft, in Portland, Oregon, bound for Seattle, Washington.

## The Hijacking

At approximately 3:00 PM, Cooper handed flight attendant Florence Schaffner a note claiming he had a bomb. When she initially dismissed it, Cooper calmly opened his briefcase, revealing red cylinders, wires, and a battery. Schaffner alerted the cockpit, and Cooper's demands were simple but precise:

- $200,000 in twenty-dollar bills (approximately $1.3 million today)
- Four parachutes (two primary, two reserve)
- Fuel trucks standing by in Seattle to refuel the plane

## The Professional Approach

What set Cooper apart from other hijackers was his demeanor. Witnesses described him as:
- Polite and well-dressed in a business suit and black tie
- Calm and collected throughout the ordeal
- Knowledgeable about aviation terminology
- Ordering bourbon and soda while waiting for his demands to be met

## The Escape

After receiving the money and parachutes in Seattle, Cooper released the 36 passengers but kept several crew members aboard. He then issued specific flight instructions:
- Fly toward Mexico City at low speed (approximately 200 mph)
- Maintain low altitude (under 10,000 feet)
- Configure the aircraft in a specific landing approach (gear down, flaps lowered)

Around 8:00 PM, during a heavy rainstorm over southwestern Washington's dense forest, Cooper lowered the aircraft's aft stairs and jumped into the night. He was never seen again.

## The Investigation

The FBI launched one of the longest-running investigations in its history, interviewing hundreds of suspects and following thousands of tips. Despite extensive searches of the terrain below the flight path, no trace of Cooper was found for nearly a decade.

## Physical Evidence

In 1980, a young boy found $5,800 in deteriorating twenty-dollar bills along the Columbia River. The serial numbers matched those given to Cooper, providing the only confirmed physical evidence of the case.

## Theories and Suspects

Over the years, numerous suspects have been investigated:
- **Richard Floyd McCoy**: A Vietnam veteran who executed a similar hijacking months later
- **Robert Rackstraw**: A Green Beret with extensive paratrooper experience
- **Kenneth Christiansen**: A Northwest Orient employee who resembled Cooper's description
- **Sheridan Peterson**: A Boeing employee who allegedly confessed on his deathbed

## The Mystery Continues

The case officially remains unsolved. The FBI suspended active investigation in 2016 but continues to review significant physical evidence. The combination of Cooper's apparent aviation knowledge, calm demeanor, and successful escape has made this case legendary in American criminal folklore.

Did Cooper survive the jump? Was he an experienced paratrooper? Or did the harsh weather and difficult terrain claim his life that November night? The mystery of D.B. Cooper continues to captivate investigators and the public alike.
  `,
  dateOccurred: '1971-11-24',
  location: 'Portland, OR to Seattle, WA',
  status: 'cold_case',
  difficultyLevel: 'beginner',
  requiredTier: 'free',
  featuredImageUrl: null,
  audioUrl: null,
  viewCount: 892,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
  published: true,
  tags: ['Hijacking', 'FBI', 'Mystery', 'Aviation', 'Unsolved']
};

const statusColors = {
  cold_case: 'bg-accent-red/20 text-accent-red',
  active: 'bg-accent-orange/20 text-accent-orange',
  solved: 'bg-member-gold/20 text-member-gold',
  closed: 'bg-text-muted/20 text-text-muted'
};

const difficultyColors = {
  beginner: 'bg-member-silver/20 text-member-silver',
  intermediate: 'bg-accent-yellow/20 text-accent-yellow',
  advanced: 'bg-accent-red/20 text-accent-red'
};

export default function CaseFilePage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/case-files"
          className="inline-flex items-center gap-2 text-accent-yellow hover:text-accent-yellow/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Case Files
        </Link>

        {/* Case Header */}
        <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-8 mb-8 border border-border-primary">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Case Image */}
            <div className="lg:w-1/3">
              <div className="aspect-square bg-gradient-to-br from-accent-orange/20 to-bg-primary rounded-lg flex items-center justify-center">
                <div className="text-8xl opacity-30">✈️</div>
              </div>
            </div>

            {/* Case Info */}
            <div className="lg:w-2/3">
                             <div className="flex flex-wrap gap-2 mb-4">
                 <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusColors[caseFileData.status as keyof typeof statusColors]}`}>
                   {caseFileData.status.replace('_', ' ')}
                 </span>
                 <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${difficultyColors[caseFileData.difficultyLevel as keyof typeof difficultyColors]}`}>
                   {caseFileData.difficultyLevel}
                 </span>
                <span className="bg-member-silver/20 text-member-silver px-3 py-1 rounded-full text-sm font-semibold">
                  FREE CASE
                </span>
              </div>

              <h1 className="text-4xl font-display font-bold mb-3 text-shadow-crime">
                {caseFileData.title}
              </h1>
              
              {caseFileData.subtitle && (
                <p className="text-xl text-accent-orange font-medium mb-4">
                  {caseFileData.subtitle}
                </p>
              )}

              <p className="text-text-muted mb-6 text-lg">
                {caseFileData.summary}
              </p>

              {/* Case Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-text-secondary">
                  <Calendar className="w-5 h-5 mr-2 text-accent-orange" />
                  <div>
                    <div className="text-sm text-text-muted">Date Occurred</div>
                    <div className="font-semibold">{new Date(caseFileData.dateOccurred).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-text-secondary">
                  <MapPin className="w-5 h-5 mr-2 text-accent-orange" />
                  <div>
                    <div className="text-sm text-text-muted">Location</div>
                    <div className="font-semibold">{caseFileData.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-text-secondary">
                  <Eye className="w-5 h-5 mr-2 text-accent-orange" />
                  <div>
                    <div className="text-sm text-text-muted">Views</div>
                    <div className="font-semibold">{caseFileData.viewCount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Play Audio (Premium)
                </button>
                <button className="border border-accent-yellow hover:bg-accent-yellow/10 text-accent-yellow px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download PDF (Premium)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Case Content */}
        <div className="bg-bg-tertiary/60 backdrop-blur-sm rounded-lg p-8 mb-8 border border-border-primary">
          <div className="prose prose-invert max-w-none">
            {caseFileData.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-display font-bold mb-4 mt-8 text-accent-yellow">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              } else if (paragraph.startsWith('- **')) {
                // Handle bullet points with bold names
                return (
                  <div key={index} className="mb-2 pl-4">
                    <div className="text-text-secondary" dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/- \*\*(.*?)\*\*: (.*)/g, '• <strong class="text-accent-orange">$1</strong>: $2')
                    }} />
                  </div>
                );
              } else if (paragraph.startsWith('- ')) {
                return (
                  <div key={index} className="mb-2 pl-4 text-text-secondary">
                    {paragraph.replace('- ', '• ')}
                  </div>
                );
              } else {
                return (
                  <p key={index} className="mb-4 text-text-secondary leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-border-primary">
          <h3 className="text-lg font-semibold mb-4">Case Tags</h3>
          <div className="flex flex-wrap gap-2">
            {caseFileData.tags.map((tag) => (
              <span 
                key={tag}
                className="bg-bg-tertiary text-text-muted px-3 py-2 rounded-lg text-sm border border-border-primary hover:border-accent-yellow transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Premium Upgrade CTA */}
        <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-8 text-center border border-accent-yellow">
          <h2 className="text-3xl font-display font-bold mb-4">
            Want More Cases Like This?
          </h2>
          <p className="text-xl text-text-muted mb-6 max-w-2xl mx-auto">
            Unlock our complete archive of detailed case files, audio narrations, evidence galleries, and join exclusive community discussions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/membership"
              className="bg-accent-red hover:bg-accent-red/80 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-flex items-center gap-2 member-badge-glow"
            >
              Become an Investigator
              <Users className="w-6 h-6" />
            </Link>
            <Link 
              href="/case-files"
              className="border border-border-primary hover:border-accent-yellow text-text-primary px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Browse More Cases
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 