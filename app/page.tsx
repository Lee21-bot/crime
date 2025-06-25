import Link from 'next/link'
import { ArrowRight, Users, FileText, Volume2, Shield, Search, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-shadow-crime">
              <span className="text-accent-yellow">Shadow</span>
              <span className="text-text-primary">Files</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-4">
              True Crime Community
            </p>
            <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
              Dive deep into the world's most compelling cold cases. Join our premium community for exclusive access to detailed case files, audio narrations, and real-time discussions with fellow investigators.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/membership"
                className="bg-accent-red hover:bg-accent-red/80 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center gap-2 member-badge-glow"
              >
                Join Investigators
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/case-files"
                className="border border-border-primary hover:border-accent-yellow text-text-primary px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Browse Cases
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
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Featured Cases
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-bg-tertiary/60 backdrop-blur-sm rounded-lg overflow-hidden border border-border-primary hover:border-accent-yellow transition-colors">
              <div className="h-48 bg-gradient-to-br from-accent-red/20 to-bg-primary flex items-center justify-center">
                <div className="text-6xl opacity-30">🕵️</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-accent-red/20 text-accent-red px-2 py-1 rounded text-sm">Cold Case</span>
                  <span className="text-text-muted text-sm">1947</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">The Black Dahlia</h3>
                <p className="text-text-muted text-sm mb-4">
                  One of Los Angeles' most notorious unsolved murders that continues to captivate investigators...
                </p>
                <Link 
                  href="/membership"
                  className="text-accent-yellow hover:text-accent-yellow/80 font-semibold text-sm flex items-center gap-1"
                >
                  Join to Read Full Case
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-bg-tertiary/60 backdrop-blur-sm rounded-lg overflow-hidden border border-border-primary hover:border-accent-yellow transition-colors">
              <div className="h-48 bg-gradient-to-br from-accent-orange/20 to-bg-primary flex items-center justify-center">
                <div className="text-6xl opacity-30">📁</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-accent-orange/20 text-accent-orange px-2 py-1 rounded text-sm">Active</span>
                  <span className="text-text-muted text-sm">1996</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">JonBenét Ramsey</h3>
                <p className="text-text-muted text-sm mb-4">
                  A case that shocked America and remains one of the most analyzed investigations in history...
                </p>
                <Link 
                  href="/membership"
                  className="text-accent-yellow hover:text-accent-yellow/80 font-semibold text-sm flex items-center gap-1"
                >
                  Join to Read Full Case
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-bg-tertiary/60 backdrop-blur-sm rounded-lg overflow-hidden border border-border-primary hover:border-accent-yellow transition-colors">
              <div className="h-48 bg-gradient-to-br from-member-gold/20 to-bg-primary flex items-center justify-center">
                <div className="text-6xl opacity-30">🔍</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-member-gold/20 text-member-gold px-2 py-1 rounded text-sm">Premium</span>
                  <span className="text-text-muted text-sm">1969</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Zodiac Killer</h3>
                <p className="text-text-muted text-sm mb-4">
                  The cryptic serial killer who terrorized Northern California and taunted police with coded letters...
                </p>
                <Link 
                  href="/membership"
                  className="text-accent-yellow hover:text-accent-yellow/80 font-semibold text-sm flex items-center gap-1"
                >
                  Join to Read Full Case
                  <ArrowRight className="w-4 h-4" />
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
