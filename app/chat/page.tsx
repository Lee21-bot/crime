'use client'

import { useEffect, useState } from 'react'
import { ChatWindow } from '../../components/chat/chat-window'
import { useAuth } from '../../providers/auth-provider'
import Link from 'next/link'

const CHAT_CHANNELS = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Case Discussions' },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Case Theories' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Evidence Analysis' },
  { id: '00000000-0000-0000-0000-000000000004', name: 'Member Lounge' }
]

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState(CHAT_CHANNELS[0])
  const { user, isInvestigator, userSubscription, loading } = useAuth()

  // Show loading state while auth context is initializing
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Investigator Chat</h1>
          <p className="text-text-secondary text-lg mb-8">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Investigator Chat</h1>
          <p className="text-text-secondary text-lg mb-8">
            Please sign in to access the chat features.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-accent-red hover:bg-accent-red/80 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (!userSubscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Subscription Required</h1>
          <p className="text-text-secondary text-lg mb-8">
            Please subscribe to access the chat features.
          </p>
          <Link
            href="/membership"
            className="inline-block bg-accent-red hover:bg-accent-red/80 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View Membership Options
          </Link>
        </div>
      </div>
    )
  }

  if (!isInvestigator) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Upgrade Required</h1>
          <p className="text-text-secondary text-lg mb-4">
            The chat feature is exclusively available to active Investigator tier members.
          </p>
          <p className="text-text-secondary text-lg mb-8">
            Upgrade your membership to join discussions, share theories, and connect with fellow investigators.
          </p>
          <Link
            href="/membership"
            className="inline-block bg-accent-red hover:bg-accent-red/80 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Upgrade to Investigator
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-4">Investigator Chat</h1>
          <p className="text-text-secondary text-lg">
            Connect with fellow investigators and discuss cases in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Channel List */}
          <div className="lg:col-span-1">
            <div className="bg-bg-tertiary/60 backdrop-blur-sm rounded-lg border border-border-primary p-4">
              <h2 className="text-xl font-semibold mb-4">Channels</h2>
              <div className="space-y-2">
                {CHAT_CHANNELS.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedChannel.id === channel.id
                        ? 'bg-accent-red/20 text-accent-yellow'
                        : 'hover:bg-bg-secondary/80 text-text-secondary'
                    }`}
                  >
                    # {channel.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 h-[600px]">
            <ChatWindow
              channelId={selectedChannel.id}
              channelName={selectedChannel.name}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 