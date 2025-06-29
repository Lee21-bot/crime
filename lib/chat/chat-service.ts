import { createClient } from '../supabase/client'

export interface ChatMessage {
  id: string
  user_id: string
  username: string
  content: string
  created_at: string
  channel_id: string
  is_moderated: boolean
  moderation_status: 'pending' | 'approved' | 'rejected'
  moderation_reason: string | null
  moderated_at: string | null
  moderated_by: string | null
}

export interface TypingIndicator {
  id: string
  user_id: string
  username: string
  channel_id: string
  started_at: string
}

export interface UserPresence {
  id: string
  user_id: string
  username: string
  status: 'online' | 'offline' | 'away'
  last_seen: string
}

let typingTimeout: ReturnType<typeof setTimeout> | null = null

export class ChatService {
  private supabase = createClient()

  async sendMessage(channelId: string, content: string, userId: string, username: string) {
    return await this.supabase
      .from('chat_messages')
      .insert([{
        channel_id: channelId,
        content,
        user_id: userId,
        username,
        created_at: new Date().toISOString(),
        is_moderated: false,
        moderation_status: 'approved'
      }])
      .select()
  }

  async moderateMessage(messageId: string, status: 'approved' | 'rejected', moderatorId: string, reason?: string) {
    return await this.supabase.from('chat_messages').update({
      is_moderated: true,
      moderation_status: status,
      moderation_reason: reason || null,
      moderated_at: new Date().toISOString(),
      moderated_by: moderatorId
    }).eq('id', messageId)
  }

  subscribeToMessages(channelId: string, onMessage: (message: ChatMessage) => void) {
    // Disable Realtime subscriptions to prevent WebSocket connection errors
    console.log('Realtime subscriptions disabled - using polling instead')
    return {
      unsubscribe: () => {}
    }
  }

  async getMessages(channelId: string, limit = 50) {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data.reverse()
  }

  async setTypingStatus(channelId: string, userId: string, username: string, isTyping: boolean) {
    if (isTyping) {
      await this.supabase.from('chat_typing').upsert([{
        channel_id: channelId,
        user_id: userId,
        username,
        started_at: new Date().toISOString()
      }])

      if (typingTimeout) clearTimeout(typingTimeout)

      typingTimeout = setTimeout(async () => {
        await this.supabase.from('chat_typing').delete().eq('user_id', userId).eq('channel_id', channelId)
      }, 3000)
    } else {
      await this.supabase.from('chat_typing').delete().eq('user_id', userId).eq('channel_id', channelId)
    }
  }

  subscribeToTypingIndicators(channelId: string, onTypingChange: (typingUsers: TypingIndicator[]) => void) {
    // Disable Realtime subscriptions to prevent WebSocket connection errors
    console.log('Typing indicators Realtime subscriptions disabled')
    return {
      unsubscribe: () => {}
    }
  }

  // New presence methods
  async updatePresence(userId: string, username: string, status: 'online' | 'offline' | 'away' = 'online') {
    return await this.supabase.from('chat_presence').upsert([
      {
        user_id: userId,
        username,
        status,
        last_seen: new Date().toISOString()
      }
    ], { onConflict: 'user_id' });
  }

  async getOnlineUsers() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data, error } = await this.supabase
      .from('chat_presence')
      .select('*')
      .gte('last_seen', fiveMinutesAgo)
      .order('username')

    if (error) throw error
    return data
  }

  subscribeToPresence(onPresenceChange: (users: UserPresence[]) => void) {
    // Disable Realtime subscriptions to prevent WebSocket connection errors
    console.log('Presence Realtime subscriptions disabled')
    return {
      unsubscribe: () => {}
    }
  }
}