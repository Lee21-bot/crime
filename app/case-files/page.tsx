import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight, Filter, Search } from 'lucide-react'

// Mock case files data
const mockCaseFiles = [
  {
    id: 1,
    slug: 'black-dahlia-1947',
    title: 'The Black Dahlia',
    subtitle: 'Elizabeth Short Murder',
    summary: 'One of Los Angeles\' most notorious unsolved murders that continues to captivate investigators decades later.',
    dateOccurred: '1947-01-15',
    location: 'Los Angeles, CA',
    status: 'cold_case',
    difficultyLevel: 'intermediate',
    requiredTier: 'investigator',
    featuredImageUrl: null,
    viewCount: 1247,
    tags: ['Homicide', 'Cold Case', 'Los Angeles']
  },
  {
    id: 2,
    slug: 'zodiac-killer-1969',
    title: 'Zodiac Killer',
    subtitle: 'The Cryptic Serial Killer',
    summary: 'The mysterious serial killer who terrorized Northern California and taunted police with coded letters.',
    dateOccurred: '1968-12-20',
    location: 'Northern California',
    status: 'cold_case',
    difficultyLevel: 'advanced',
    requiredTier: 'investigator',
    featuredImageUrl: null,
    viewCount: 2156,
    tags: ['Serial Killer', 'Cryptography', 'Cold Case']
  },
  {
    id: 3,
    slug: 'jonbenet-ramsey-1996',
    title: 'JonBenét Ramsey',
    subtitle: 'The Beauty Queen Mystery',
    summary: 'A case that shocked America and remains one of the most analyzed investigations in true crime history.',
    dateOccurred: '1996-12-26',
    location: 'Boulder, CO',
    status: 'active',
    difficultyLevel: 'advanced',
    requiredTier: 'investigator',
    featuredImageUrl: null,
    viewCount: 3421,
    tags: ['Homicide', 'Child Victim', 'Media Coverage']
  },
  {
    id: 4,
    slug: 'db-cooper-1971',
    title: 'D.B. Cooper',
    subtitle: 'The Gentleman Skyjacker',
    summary: 'The only unsolved commercial aircraft hijacking in American history - a mysterious man who vanished into thin air.',
    dateOccurred: '1971-11-24',
    location: 'Portland, OR',
    status: 'cold_case',
    difficultyLevel: 'beginner',
    requiredTier: 'free',
    featuredImageUrl: null,
    viewCount: 892,
    tags: ['Hijacking', 'FBI', 'Mystery']
  },
  {
    id: 5,
    slug: 'jack-the-ripper-1888',
    title: 'Jack the Ripper',
    subtitle: 'Whitechapel Murders',
    summary: 'The infamous unidentified serial killer who terrorized London\'s East End in 1888.',
    dateOccurred: '1888-08-31',
    location: 'London, England',
    status: 'cold_case',
    difficultyLevel: 'advanced',
    requiredTier: 'investigator',
    featuredImageUrl: null,
    viewCount: 4567,
    tags: ['Serial Killer', 'Victorian Era', 'London']
  },
  {
    id: 6,
    slug: 'amelia-earhart-1937',
    title: 'Amelia Earhart',
    subtitle: 'The Vanishing Aviator',
    summary: 'The pioneering aviator who disappeared over the Pacific Ocean during her attempt to circumnavigate the globe.',
    dateOccurred: '1937-07-02',
    location: 'Pacific Ocean',
    status: 'cold_case',
    difficultyLevel: 'intermediate',
    requiredTier: 'free',
    featuredImageUrl: null,
    viewCount: 1834,
    tags: ['Missing Person', 'Aviation', 'Pacific']
  }
];

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

export default function CaseFilesPage() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-shadow-crime">
            Case Files Archive
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Explore our curated collection of history's most compelling mysteries and unsolved cases. 
            Each file contains detailed investigation reports, evidence analysis, and expert insights.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-border-primary">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search case files..."
                className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:border-accent-yellow focus:outline-none"
              />
            </div>
            <div className="flex gap-4">
              <select className="px-4 py-3 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:border-accent-yellow focus:outline-none">
                <option value="">All Status</option>
                <option value="cold_case">Cold Case</option>
                <option value="active">Active</option>
                <option value="solved">Solved</option>
              </select>
              <select className="px-4 py-3 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:border-accent-yellow focus:outline-none">
                <option value="">All Difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Case Files Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCaseFiles.map((caseFile) => (
            <div 
              key={caseFile.id}
              className="bg-bg-tertiary/60 backdrop-blur-sm rounded-lg overflow-hidden border border-border-primary hover:border-accent-yellow transition-all duration-300 group"
            >
              {/* Case Image/Icon */}
              <div className="h-48 bg-gradient-to-br from-accent-red/10 via-bg-primary to-accent-orange/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                    🕵️
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusColors[caseFile.status]}`}>
                    {caseFile.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Premium Badge */}
                {caseFile.requiredTier === 'investigator' && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-member-gold/20 text-member-gold px-2 py-1 rounded text-xs font-semibold member-badge-glow">
                      PREMIUM
                    </span>
                  </div>
                )}
              </div>

              {/* Case Details */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${difficultyColors[caseFile.difficultyLevel]}`}>
                    {caseFile.difficultyLevel}
                  </span>
                  <div className="flex items-center text-text-muted text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(caseFile.dateOccurred).getFullYear()}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-accent-yellow transition-colors">
                  {caseFile.title}
                </h3>
                
                {caseFile.subtitle && (
                  <p className="text-accent-orange font-medium text-sm mb-3">
                    {caseFile.subtitle}
                  </p>
                )}

                <p className="text-text-muted text-sm mb-4 line-clamp-3">
                  {caseFile.summary}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-text-muted text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {caseFile.location}
                  </div>
                  <div className="flex items-center text-text-muted text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {caseFile.viewCount.toLocaleString()} views
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {caseFile.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag}
                      className="bg-bg-secondary/60 text-text-muted px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                {caseFile.requiredTier === 'free' ? (
                  <Link 
                    href={`/case-files/${caseFile.slug}`}
                    className="w-full bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Read Case File
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link 
                    href="/membership"
                    className="w-full border border-accent-yellow hover:bg-accent-yellow/10 text-accent-yellow py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Join to Access
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-12">
          <p className="text-text-muted mb-6">
            Showing 6 of 127 case files
          </p>
          <button className="bg-bg-secondary hover:bg-bg-secondary/80 text-text-primary px-8 py-3 rounded-lg font-semibold transition-colors border border-border-primary hover:border-accent-yellow">
            Load More Cases
          </button>
        </div>

        {/* Membership CTA */}
        <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-8 mt-16 text-center border border-border-primary">
          <h2 className="text-3xl font-display font-bold mb-4">
            Unlock Premium Case Files
          </h2>
          <p className="text-xl text-text-muted mb-6 max-w-2xl mx-auto">
            Become an Investigator member to access detailed case files, audio narrations, evidence galleries, and exclusive community discussions.
          </p>
          <Link 
            href="/membership"
            className="bg-accent-red hover:bg-accent-red/80 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-flex items-center gap-2 member-badge-glow"
          >
            Join Investigators
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  )
} 