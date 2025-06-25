import Link from 'next/link'
import { Check, ArrowRight, Users, FileText, Volume2, Download, MessageCircle, Search } from 'lucide-react'
import { MEMBERSHIP_TIERS } from '../../lib/subscription/membership'

export default function MembershipPage() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-shadow-crime">
            Join the Investigation
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Unlock exclusive access to detailed case files, audio narrations, and connect with fellow investigators in our premium community.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Free Tier */}
          <div className="bg-bg-tertiary/60 backdrop-blur-sm border border-border-primary rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-display font-bold mb-2">
                {MEMBERSHIP_TIERS.FREE.name}
              </h3>
              <div className="text-4xl font-bold mb-4">
                <span className="text-text-primary">Free</span>
              </div>
              <p className="text-text-muted">
                Get a taste of our true crime community
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {MEMBERSHIP_TIERS.FREE.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent-yellow flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full border border-border-primary hover:border-accent-yellow text-text-primary py-3 rounded-lg font-semibold transition-colors">
              Current Plan
            </button>
          </div>

          {/* Investigator Tier */}
          <div className="bg-bg-tertiary/80 backdrop-blur-sm border-2 border-accent-yellow rounded-lg p-8 relative member-badge-glow">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-accent-yellow text-bg-primary px-4 py-2 rounded-full text-sm font-bold">
                MOST POPULAR
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-display font-bold mb-2">
                {MEMBERSHIP_TIERS.INVESTIGATOR.name}
              </h3>
              <div className="text-4xl font-bold mb-2">
                <span className="text-accent-yellow">${(MEMBERSHIP_TIERS.INVESTIGATOR.price / 100).toFixed(2)}</span>
                <span className="text-lg text-text-muted">/month</span>
              </div>
              <p className="text-text-muted">
                Full access to our crime investigation platform
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {MEMBERSHIP_TIERS.INVESTIGATOR.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent-yellow flex-shrink-0 mt-0.5" />
                  <span className="text-text-primary font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-accent-red hover:bg-accent-red/80 text-white py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 member-badge-glow">
              Become an Investigator
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-display font-bold text-center mb-8">
            What You Get as an Investigator
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4 evidence-marker">
                <FileText className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Case Files</h3>
              <p className="text-text-muted">
                Access detailed case documentation, evidence timelines, witness statements, and investigation reports.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4 evidence-marker">
                <Volume2 className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Audio</h3>
              <p className="text-text-muted">
                Listen to expertly narrated case files with immersive storytelling and high-quality voice acting.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4 evidence-marker">
                <MessageCircle className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Chat</h3>
              <p className="text-text-muted">
                Join real-time discussions with fellow investigators and share theories about ongoing cases.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4 evidence-marker">
                <Download className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Downloadable Content</h3>
              <p className="text-text-muted">
                Download case file PDFs, evidence photos, and timeline documents for offline study.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4 evidence-marker">
                <Search className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
              <p className="text-text-muted">
                Use sophisticated filtering tools to explore cases by location, date, type, and difficulty level.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-orange/20 rounded-lg flex items-center justify-center mx-auto mb-4 evidence-marker">
                <Users className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Access</h3>
              <p className="text-text-muted">
                Connect with a community of true crime enthusiasts and experienced investigators.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-bg-tertiary/60 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <h3 className="text-xl font-semibold mb-3">Can I cancel anytime?</h3>
              <p className="text-text-muted">
                Yes, you can cancel your Investigator membership at any time. You'll continue to have access until the end of your current billing period.
              </p>
            </div>

            <div className="bg-bg-tertiary/60 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <h3 className="text-xl font-semibold mb-3">How often are new cases added?</h3>
              <p className="text-text-muted">
                We add new case files regularly, typically 2-3 comprehensive cases per month, along with case updates and community discussions.
              </p>
            </div>

            <div className="bg-bg-tertiary/60 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <h3 className="text-xl font-semibold mb-3">Is the content appropriate for all ages?</h3>
              <p className="text-text-muted">
                Our content is designed for mature audiences (18+) due to the nature of true crime cases. All content is presented respectfully and focuses on the investigative aspects.
              </p>
            </div>

            <div className="bg-bg-tertiary/60 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
              <h3 className="text-xl font-semibold mb-3">Can I download content for offline viewing?</h3>
              <p className="text-text-muted">
                Investigator members can download case file PDFs and audio files for offline study. Downloaded content is for personal use only.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-text-muted mb-6">
            Ready to start your investigation?
          </p>
          <Link 
            href="/"
            className="bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-flex items-center gap-2 member-badge-glow"
          >
            Join ShadowFiles Today
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  )
} 