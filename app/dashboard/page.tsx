'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Crown, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Calendar,
  Eye,
  TrendingUp,
  Star,
  Edit,
  Save,
  X
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../providers/auth-provider'
import { Input } from '../../components/ui/input'
import { createClient } from '../../lib/supabase/client'

export default function DashboardPage() {
  const { user, userProfile, userSubscription, isInvestigator, signOut, loading, refreshUserData } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(userProfile?.display_name || '')
  const [userColor, setUserColor] = useState(userProfile?.color || '#3B82F6') // Default blue
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleUpdateProfile = async () => {
    if (!user || !displayName.trim()) return
    
    setIsUpdating(true)
    try {
      const supabase = createClient()
      
      console.log('Attempting to update profile for user:', user.id)
      console.log('New display name:', displayName.trim())
      console.log('New color:', userColor)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          display_name: displayName.trim(),
          color: userColor,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()

      console.log('Update result:', { data, error })

      if (error) {
        console.error('Error updating profile:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        alert(`Failed to update profile: ${error.message}`)
        return
      }

      console.log('Profile updated successfully:', data)
      await refreshUserData()
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to update profile: ${errorMessage}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setDisplayName(userProfile?.display_name || '')
    setUserColor(userProfile?.color || '#3B82F6')
    setIsEditing(false)
  }

  // Update local state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.display_name || '')
      setUserColor(userProfile.color || '#3B82F6')
    }
  }, [userProfile])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">
              Welcome back, {userProfile?.display_name || user.email?.split('@')[0]}
            </h1>
            <p className="text-xl text-text-muted">
              Your investigation headquarters
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Membership Status */}
        <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${isInvestigator ? 'bg-member-gold/20 member-badge-glow' : 'bg-member-silver/20'}`}>
                <Crown className={`w-8 h-8 ${isInvestigator ? 'text-member-gold' : 'text-member-silver'}`} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">
                  {isInvestigator ? 'Investigator Member' : 'Visitor'}
                </h2>
                <p className="text-text-muted">
                  {isInvestigator 
                    ? 'Full access to case files, chat, and premium features' 
                    : 'Limited access to public content'
                  }
                </p>
              </div>
            </div>
            
            {!isInvestigator && (
              <Link href="/membership">
                <Button variant="premium">
                  Upgrade to Investigator
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-bg-tertiary/60 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-accent-orange" />
              <span className="text-sm text-text-muted">Cases Viewed</span>
            </div>
            <p className="text-2xl font-bold">12</p>
          </div>

          <div className="bg-bg-tertiary/60 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-accent-orange" />
              <span className="text-sm text-text-muted">Chat Messages</span>
            </div>
            <p className="text-2xl font-bold">{isInvestigator ? '47' : '0'}</p>
          </div>

          <div className="bg-bg-tertiary/60 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-accent-orange" />
              <span className="text-sm text-text-muted">Member Since</span>
            </div>
            <p className="text-sm font-medium">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
            </p>
          </div>

          <div className="bg-bg-tertiary/60 backdrop-blur-sm p-6 rounded-lg border border-border-primary">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-accent-orange" />
              <span className="text-sm text-text-muted">Rank</span>
            </div>
            <p className="text-sm font-medium">
              {isInvestigator ? 'Lead Detective' : 'Junior Investigator'}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-border-primary">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-orange" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-bg-tertiary/60 rounded-lg">
                  <div className="w-10 h-10 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-accent-orange" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Viewed D.B. Cooper case file</p>
                    <p className="text-sm text-text-muted">2 hours ago</p>
                  </div>
                </div>

                {isInvestigator && (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-bg-tertiary/60 rounded-lg">
                      <div className="w-10 h-10 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-accent-orange" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Posted in General Discussion</p>
                        <p className="text-sm text-text-muted">1 day ago</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-bg-tertiary/60 rounded-lg">
                      <div className="w-10 h-10 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-accent-orange" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Downloaded Black Dahlia case PDF</p>
                        <p className="text-sm text-text-muted">3 days ago</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-4 p-4 bg-bg-tertiary/60 rounded-lg">
                  <div className="w-10 h-10 bg-member-gold/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-member-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Account created</p>
                    <p className="text-sm text-text-muted">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-border-primary">
              <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
              
              <div className="space-y-4">
                <Link href="/case-files">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4" />
                    Browse Case Files
                  </Button>
                </Link>
                
                {isInvestigator ? (
                  <Link href="/chat">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4" />
                      Join Member Chat
                    </Button>
                  </Link>
                ) : (
                  <Link href="/membership">
                    <Button variant="premium" className="w-full justify-start">
                      <Crown className="w-4 h-4" />
                      Upgrade Account
                    </Button>
                  </Link>
                )}
                
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Button>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-border-primary">
              <h3 className="text-xl font-semibold mb-6">Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-muted">Display Name</label>
                  <p className="font-medium">{userProfile?.display_name || 'Not set'}</p>
                </div>
                
                <div>
                  <label className="text-sm text-text-muted">Email</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm text-text-muted">Chat Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-6 h-6 rounded-full border border-border-primary shadow-sm"
                      style={{ backgroundColor: userProfile?.color || '#3B82F6' }}
                    />
                    <span className="text-sm font-medium">{userProfile?.color || '#3B82F6'}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-text-muted">Member Type</label>
                  <p className="font-medium">{isInvestigator ? 'Investigator' : 'Visitor'}</p>
                </div>
              </div>

              {isEditing ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm text-text-muted">Display Name</label>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter new display name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-text-muted">Chat Color</label>
                    <div className="flex items-center gap-3 mt-1">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-border-primary shadow-sm"
                        style={{ backgroundColor: userColor }}
                      />
                      <Input
                        type="color"
                        value={userColor}
                        onChange={(e) => setUserColor(e.target.value)}
                        className="w-16 h-8 p-1 border border-border-primary rounded cursor-pointer"
                      />
                      <span className="text-xs text-text-muted">{userColor}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">This color will be used for your avatar in chat</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                    >
                      <Save className="w-4 h-4" />
                      {isUpdating ? 'Saving...' : 'Save'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 