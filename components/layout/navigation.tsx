'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, LogIn, Crown, MessageSquare, FileText } from 'lucide-react'
import { Button } from '../ui/button'
import { useAuth } from '../../providers/auth-provider'

export function Navigation() {
  const { user, userProfile, isInvestigator, loading } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-bg-secondary/80 backdrop-blur-sm border-b border-border-primary sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-accent-yellow font-display font-bold text-xl">
              ShadowFiles
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/case-files"
              className={`text-sm font-medium transition-colors hover:text-accent-yellow ${
                isActive('/case-files') ? 'text-accent-yellow' : 'text-text-secondary'
              }`}
            >
              Case Files
            </Link>

            {isInvestigator && (
              <Link 
                href="/chat"
                className={`text-sm font-medium transition-colors hover:text-accent-yellow ${
                  isActive('/chat') ? 'text-accent-yellow' : 'text-text-secondary'
                }`}
              >
                Member Chat
              </Link>
            )}

            <Link 
              href="/membership"
              className={`text-sm font-medium transition-colors hover:text-accent-yellow ${
                isActive('/membership') ? 'text-accent-yellow' : 'text-text-secondary'
              }`}
            >
              Membership
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 border-2 border-accent-yellow border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {/* Member Badge */}
                {isInvestigator && (
                  <div className="flex items-center space-x-1 bg-member-gold/20 px-2 py-1 rounded-full member-badge-glow">
                    <Crown className="w-4 h-4 text-member-gold" />
                    <span className="text-member-gold text-xs font-semibold">Investigator</span>
                  </div>
                )}

                {/* User Profile */}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {userProfile?.display_name || user.email?.split('@')[0]}
                    </span>
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link 
              href="/case-files"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/case-files') 
                  ? 'bg-accent-yellow/10 text-accent-yellow' 
                  : 'text-text-secondary hover:text-accent-yellow hover:bg-accent-yellow/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Case Files</span>
            </Link>

            {isInvestigator && (
              <Link 
                href="/chat"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/chat') 
                    ? 'bg-accent-yellow/10 text-accent-yellow' 
                    : 'text-text-secondary hover:text-accent-yellow hover:bg-accent-yellow/5'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Member Chat</span>
              </Link>
            )}

            <Link 
              href="/membership"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/membership') 
                  ? 'bg-accent-yellow/10 text-accent-yellow' 
                  : 'text-text-secondary hover:text-accent-yellow hover:bg-accent-yellow/5'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Membership</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 