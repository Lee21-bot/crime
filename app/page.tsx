import Link from 'next/link'
import { ArrowRight, Users, FileText, Volume2, Shield, Search, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-24 md:py-32">
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-12 tracking-tight text-shadow-glow">
              Unravel the <span className="text-accent-red text-shadow-crime">Unknown</span>
            </h1>
            
            <div className="mb-16 space-y-6">
              <p className="text-2xl md:text-3xl tagline-text text-text-secondary leading-relaxed font-light">
                Every shadow holds a secret. Every whisper tells a story.
              </p>
              
              <p className="text-3xl md:text-4xl font-display font-medium italic tracking-wide text-red-500 text-shadow-crime !important">
                The truth awaits in the darkness.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/membership"
                className="bg-accent-red hover:bg-accent-red/80 text-white px-10 py-5 rounded-lg font-display font-semibold text-lg transition-all duration-300 flex items-center gap-3 member-badge-glow btn-crime-scene shadow-xl"
              >
                <Volume2 className="w-6 h-6" />
                Start Listening
              </Link>
              <Link 
                href="/case-files"
                className="bg-bg-secondary/80 backdrop-blur-sm border-2 border-accent-yellow hover:bg-accent-yellow/10 text-accent-yellow px-10 py-5 rounded-lg font-display font-semibold text-lg transition-all duration-300 flex items-center gap-3 btn-crime-scene shadow-xl"
              >
                <FileText className="w-6 h-6" />
                Download App
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 bg-bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Uncover the Truth
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-bg-tertiary/80 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <div className="evidence-marker w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed Case Files</h3>
              <p className="text-text-muted">
                Access comprehensive case documents, timelines, and evidence photos from history's most intriguing mysteries.
              </p>
            </div>

            <div className="bg-bg-tertiary/80 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <div className="evidence-marker w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Audio Narration</h3>
              <p className="text-text-muted">
                Listen to professionally narrated case files with immersive storytelling that brings each mystery to life.
              </p>
            </div>

            <div className="bg-bg-tertiary/80 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <div className="evidence-marker w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Member Chat</h3>
              <p className="text-text-muted">
                Join real-time discussions with fellow crime enthusiasts and share theories in our exclusive member chat.
              </p>
            </div>

            <div className="bg-bg-tertiary/80 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <div className="evidence-marker w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Investigation Tools</h3>
              <p className="text-text-muted">
                Advanced search and filtering tools to help you explore cases by date, location, type, and difficulty level.
              </p>
            </div>

            <div className="bg-bg-tertiary/80 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <div className="evidence-marker w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cold Case Archive</h3>
              <p className="text-text-muted">
                Explore our growing archive of cold cases, from classic mysteries to lesser-known investigations.
              </p>
            </div>

            <div className="bg-bg-tertiary/80 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <div className="evidence-marker w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Content</h3>
              <p className="text-text-muted">
                Exclusive access to detailed evidence galleries, downloadable PDFs, and member-only case discussions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cases Preview */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <h2 className="text-5xl font-display font-bold text-center mb-16 text-shadow-glow">
            Featured Stories
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="case-card bg-bg-tertiary/60 backdrop-blur-sm rounded-lg overflow-hidden border border-border-primary hover:border-accent-yellow">
              <div className="h-64 bg-gradient-to-br from-accent-red/20 to-bg-primary flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 to-transparent"></div>
                <div className="text-7xl opacity-20">🕵️</div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-accent-red/20 text-accent-red px-3 py-1 rounded-full text-sm font-medium">Cold Case</span>
                  <span className="text-text-muted text-sm font-mono">1947</span>
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-shadow-glow">The Black Dahlia</h3>
                <p className="text-text-muted mb-6 leading-relaxed">
                  One of Los Angeles' most notorious unsolved murders that continues to captivate investigators across decades...
                </p>
                <Link 
                  href="/membership"
                  className="text-accent-yellow hover:text-accent-yellow/80 font-display font-semibold flex items-center gap-2 group"
                >
                  Join to Read Full Case
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="case-card bg-bg-tertiary/60 backdrop-blur-sm rounded-lg overflow-hidden border border-border-primary hover:border-accent-yellow">
              <div className="h-64 bg-gradient-to-br from-accent-orange/20 to-bg-primary flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 to-transparent"></div>
                <div className="text-7xl opacity-20">📁</div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-accent-orange/20 text-accent-orange px-3 py-1 rounded-full text-sm font-medium">Active</span>
                  <span className="text-text-muted text-sm font-mono">1996</span>
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-shadow-glow">JonBenét Ramsey</h3>
                <p className="text-text-muted mb-6 leading-relaxed">
                  A case that shocked America and remains one of the most analyzed investigations in history...
                </p>
                <Link 
                  href="/membership"
                  className="text-accent-yellow hover:text-accent-yellow/80 font-display font-semibold flex items-center gap-2 group"
                >
                  Join to Read Full Case
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="case-card bg-bg-tertiary/60 backdrop-blur-sm rounded-lg overflow-hidden border border-border-primary hover:border-accent-yellow">
              <div className="h-64 bg-gradient-to-br from-member-gold/20 to-bg-primary flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 to-transparent"></div>
                <div className="text-7xl opacity-20">🔍</div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-member-gold/20 text-member-gold px-3 py-1 rounded-full text-sm font-medium member-badge-glow">Premium</span>
                  <span className="text-text-muted text-sm font-mono">1969</span>
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-shadow-glow">Zodiac Killer</h3>
                <p className="text-text-muted mb-6 leading-relaxed">
                  The cryptic serial killer who terrorized Northern California and taunted police with coded letters...
                </p>
                <Link 
                  href="/membership"
                  className="text-accent-yellow hover:text-accent-yellow/80 font-display font-semibold flex items-center gap-2 group"
                >
                  Join to Read Full Case
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6">
            Ready to Join the Investigation?
          </h2>
          <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Become an Investigator member to unlock full case files, audio narrations, and join our exclusive community discussions.
          </p>
          <Link 
            href="/membership"
            className="bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-flex items-center gap-2 member-badge-glow"
          >
            Start Your Investigation
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  )
}
