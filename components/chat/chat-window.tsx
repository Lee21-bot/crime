import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../providers/auth-provider'
import { ChatService } from '../../lib/chat/chat-service'
import type { ChatMessage, TypingIndicator, UserPresence } from '../../lib/chat/chat-service'
import { Send, Check, X, Circle } from 'lucide-react'
import Link from 'next/link'

interface ChatWindowProps {
  channelId: string
  channelName: string
}

// Utility: get contrast color (white or black) for a given hex background
function getContrastYIQ(hexcolor: string) {
  if (!hexcolor) return 'white';
  let hex = hexcolor.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const r = parseInt(hex.substr(0,2),16);
  const g = parseInt(hex.substr(2,2),16);
  const b = parseInt(hex.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 180) ? 'black' : 'white';
}

export function ChatWindow({ channelId, channelName }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const chatService = new ChatService()
  const { user, loading, userProfile, isInvestigator } = useAuth()
  const isAdmin = user?.email?.endsWith('@admin.com') || false

  // Build a map of user_id to profile (for color lookup)
  const userProfilesMap = React.useMemo(() => {
    const map: Record<string, { color?: string }> = {}
    onlineUsers.forEach(u => {
      if (u.user_id && u.color) map[u.user_id] = { color: u.color }
    })
    // Add current user
    if (user && userProfile?.color) map[user.id] = { color: userProfile.color }
    return map
  }, [onlineUsers, user, userProfile])

  // Check if user is at bottom of messages
  const checkIfAtBottom = () => {
    if (!messagesContainerRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const threshold = 50 // pixels from bottom
    return scrollTop + clientHeight >= scrollHeight - threshold
  }

  // Handle scroll events
  const handleScroll = () => {
    setIsAtBottom(checkIfAtBottom())
  }

  // Smart scroll to bottom function
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-muted">Loading chat...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-text-muted mb-4">Please sign in to join the chat</p>
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

  if (!isInvestigator) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Upgrade Required</h3>
          <p className="text-text-muted mb-4">
            This chat channel is exclusively available to Investigator tier members.
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

  useEffect(() => {
    if (loading || !user) return

    // Load initial messages and set up polling
    let isMounted = true;
    const loadMessages = async () => {
      try {
        const messages = await chatService.getMessages(channelId)
        // Sort messages by creation time (oldest first)
        const sortedMessages = messages.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        if (isMounted) {
          setMessages(sortedMessages)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }
    loadMessages()
    const messageInterval = setInterval(loadMessages, 3000)

    // Poll for online users
    const pollOnlineUsers = async () => {
      try {
        const users = await chatService.getOnlineUsers()
        if (isMounted) setOnlineUsers(users)
      } catch (error) {
        console.error('Error loading online users:', error)
      }
    }
    pollOnlineUsers()
    const onlineInterval = setInterval(pollOnlineUsers, 5000)

    // Typing indicators logic can remain for future real-time support
    const typingSubscription = chatService.subscribeToTypingIndicators(channelId, (users) => {
      setTypingUsers(users)
    })

    // Set initial presence
    chatService.updatePresence(user.id, userProfile?.display_name || user.email || 'Anonymous')

    // Update presence every 4 minutes to stay "online"
    const presenceInterval = setInterval(() => {
      chatService.updatePresence(user.id, userProfile?.display_name || user.email || 'Anonymous')
    }, 4 * 60 * 1000)

    // Set offline status when leaving
    const handleBeforeUnload = () => {
      chatService.updatePresence(user.id, userProfile?.display_name || user.email || 'Anonymous', 'offline')
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      isMounted = false;
      clearInterval(messageInterval)
      clearInterval(onlineInterval)
      clearInterval(presenceInterval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      typingSubscription.unsubscribe()
      chatService.updatePresence(user.id, userProfile?.display_name || user.email || 'Anonymous', 'offline')
    }
  }, [channelId, user, loading])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMessage(value)

    if (user && isInvestigator) {
      // Update typing status
      await chatService.setTypingStatus(
        channelId,
        user.id,
        userProfile?.display_name || user.email || 'Anonymous',
        value.length > 0
      )
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMessage.trim()) return

    try {
      const { data, error } = await chatService.sendMessage(
        channelId,
        newMessage,
        user.id,
        userProfile?.display_name || user.email || 'Anonymous'
      ) as { data: any[]; error: any };
      if (error) {
        console.error('Supabase insert error:', error)
        alert('Failed to send message: ' + error.message)
      } else {
        // Optimistically add the message to the UI
        const newMessageObj = {
          id: data && data[0]?.id ? data[0].id : Math.random().toString(36),
          user_id: user.id,
          username: userProfile?.display_name || user.email || 'Anonymous',
          content: newMessage,
          created_at: new Date().toISOString(),
          channel_id: channelId,
          is_moderated: false,
          moderation_status: 'approved',
          moderation_reason: null,
          moderated_at: null,
          moderated_by: null,
        } as ChatMessage
        
        // Add the new message and sort by creation time
        setMessages(prev => {
          const updatedMessages = [...prev, newMessageObj]
          return updatedMessages.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        })
        setNewMessage('')
        // Force scroll to bottom when user sends a message
        setTimeout(() => scrollToBottom('smooth'), 100)
        await chatService.setTypingStatus(channelId, user.id, userProfile?.display_name || user.email || 'Anonymous', false)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      if (error instanceof Error) {
        alert('Failed to send message: ' + error.message)
      } else {
        alert('Failed to send message.')
      }
    }
  }

  const handleModerateMessage = async (messageId: string, status: 'approved' | 'rejected', reason?: string) => {
    if (!user || !isAdmin) return

    try {
      await chatService.moderateMessage(messageId, status, user.id, reason)
    } catch (error) {
      console.error('Failed to moderate message:', error)
    }
  }

  // Generate a consistent color for each user based on their username
  const getUserColor = (username: string, userId?: string) => {
    // If this is the current user and they have a chosen color, use it
    if (userId === user?.id && userProfile?.color) {
      return `bg-[${userProfile.color}]`
    }
    
    // Otherwise use hash-based color
    const colors = [
      'bg-red-600',
      'bg-blue-600', 
      'bg-green-600',
      'bg-purple-600',
      'bg-orange-600',
      'bg-pink-600',
      'bg-indigo-600',
      'bg-teal-600',
      'bg-yellow-600',
      'bg-cyan-600'
    ]
    const index = username.charCodeAt(0) % colors.length
    return colors[index]
  }

  const getUserBorderColor = (username: string, userId?: string) => {
    // If this is the current user and they have a chosen color, use it
    if (userId === user?.id && userProfile?.color) {
      return `border-[${userProfile.color}]`
    }
    
    // Otherwise use hash-based color
    const colors = [
      'border-red-600',
      'border-blue-600', 
      'border-green-600',
      'border-purple-600',
      'border-orange-600',
      'border-pink-600',
      'border-indigo-600',
      'border-teal-600',
      'border-yellow-600',
      'border-cyan-600'
    ]
    const index = username.charCodeAt(0) % colors.length
    return colors[index]
  }

  const getUserStyle = (username: string, userId?: string) => {
    // If this is the current user and they have a chosen color, use it
    if (userId === user?.id && userProfile?.color) {
      return { backgroundColor: userProfile.color }
    }
    return {}
  }

  return (
    <div className="flex flex-col h-full bg-bg-tertiary/60 backdrop-blur-sm rounded-lg border border-border-primary">
      {/* Channel Header with Online Users */}
      <div className="p-4 border-b border-border-primary">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{channelName}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">
              {onlineUsers.length} online
            </span>
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="relative flex items-center justify-center w-8 h-8 bg-bg-secondary rounded-full border-2 border-border-primary"
                  title={user.username}
                >
                  <span className="text-sm font-semibold">
                    {user.username[0].toUpperCase()}
                  </span>
                  <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-400 fill-green-400" />
                </div>
              ))}
              {onlineUsers.length > 3 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-bg-secondary rounded-full border-2 border-border-primary">
                  <span className="text-sm font-semibold">
                    +{onlineUsers.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Online Users List */}
      <div className="px-4 pt-4 pb-2 flex flex-wrap gap-3 items-center border-b border-border-primary bg-bg-secondary/60">
        {onlineUsers.length > 0 ? (
          <>
            <span className="text-sm text-text-muted mr-2 font-medium">Online:</span>
            {onlineUsers.map((userObj) => {
              const isCurrentUser = userObj.user_id === user?.id;
              const avatarColor = isCurrentUser && userProfile?.color ? userProfile.color : undefined;
              return (
                <div key={userObj.id} className="flex items-center gap-1">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${getUserColor(userObj.username, userObj.user_id)} ${getUserBorderColor(userObj.username, userObj.user_id)}`}
                    style={{ backgroundColor: avatarColor, color: avatarColor ? getContrastYIQ(avatarColor) : undefined }}
                    title={userObj.username}
                    aria-label={userObj.username}
                  >
                    {userObj.username[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-xs text-text-secondary font-medium max-w-[80px] truncate">{userObj.username}</span>
                </div>
              )
            })}
          </>
        ) : (
          <span className="text-sm text-text-muted">No one online</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-transparent" ref={messagesContainerRef} onScroll={handleScroll}>
        {messages.map((message) => {
          const isOwn = message.user_id === user.id;
          const senderColor = isOwn ? userProfile?.color : undefined;
          const textContrastClass = senderColor
            ? getContrastYIQ(senderColor) === 'black'
              ? 'chat-bubble-text-black'
              : 'chat-bubble-text-white'
            : '';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar: left for others, right for own */}
              {!isOwn && (
                <div 
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${getUserColor(message.username, message.user_id)} ${getUserBorderColor(message.username, message.user_id)}`}
                  style={getUserStyle(message.username, message.user_id)}
                  title={message.username}
                  aria-label={message.username}
                >
                  {message.username[0]?.toUpperCase() || '?'}
                </div>
              )}
              {/* Message bubble */}
              <div
                className={
                  `max-w-[60%] rounded-2xl shadow-md border break-words ` +
                  (isOwn
                    ? (senderColor ? 'ml-auto text-right' : 'bg-accent-red/80 border-accent-red text-white ml-auto text-right')
                    : 'bg-bg-secondary/80 border-border-primary mr-auto text-left')
                }
                style={{ 
                  fontSize: '1.15rem', 
                  lineHeight: '1.7rem', 
                  padding: '1.15rem 1.5rem',
                  ...(senderColor ? {
                    backgroundColor: senderColor,
                    borderColor: senderColor,
                  } : {}),
                }}
              >
                <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
                  <span className="text-xs text-text-muted">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                  {message.moderation_status === 'rejected' && (
                    <span className="text-xs text-red-400" title={message.moderation_reason || ''}>
                      Removed by Moderator
                    </span>
                  )}
                </div>
                <p className={`text-base ${textContrastClass}`} style={{ wordBreak: 'break-word' }}>
                  {message.moderation_status === 'rejected' 
                    ? 'This message has been removed by a moderator.' 
                    : message.content}
                </p>
                {/* Moderation Controls */}
                {isAdmin && message.moderation_status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleModerateMessage(message.id, 'approved')}
                      className="text-green-400 hover:text-green-300"
                      title="Approve Message"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleModerateMessage(message.id, 'rejected', 'Violated community guidelines')}
                      className="text-red-400 hover:text-red-300"
                      title="Remove Message"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {/* Avatar: right for own */}
              {isOwn && (
                <div 
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${getUserColor(message.username, message.user_id)} ${getUserBorderColor(message.username, message.user_id)}`}
                  style={getUserStyle(message.username, message.user_id)}
                  title={message.username}
                  aria-label={message.username}
                >
                  {message.username[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 flex items-center gap-2 text-lg text-text-muted border-t border-border-primary bg-bg-secondary/60">
          {typingUsers.filter(t => t.user_id !== user.id).map(t => (
            <div key={t.user_id} className="flex items-center gap-1">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${getUserColor(t.username, t.user_id)} ${getUserBorderColor(t.username, t.user_id)}`}
                style={getUserStyle(t.username, t.user_id)}
                title={t.username}
                aria-label={t.username}
              >
                {t.username[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-xs font-medium">{t.username}</span>
            </div>
          ))}
          <span className="ml-2 text-base font-normal">{typingUsers.length === 1 ? 'is typing...' : 'are typing...'}</span>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-border-primary bg-bg-secondary/80">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 bg-bg-tertiary/80 text-text-primary border border-border-primary rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow shadow-sm"
            style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-accent-red hover:bg-accent-red/80 text-white px-6 py-4 rounded-2xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            style={{ fontSize: '1.25rem' }}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  )
} 