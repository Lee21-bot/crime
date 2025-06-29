import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Debug: Log request method and headers
    console.log('--- Incoming upload request ---')
    console.log('Method:', request.method)
    console.log('Headers:', Object.fromEntries(request.headers.entries()))
    // Log cookies if present
    const cookieHeader = request.headers.get('cookie')
    console.log('Cookie header:', cookieHeader)

    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('User from supabase.auth.getUser():', user)
    if (authError) {
      console.log('Auth error:', authError)
    }
    
    if (authError || !user) {
      console.log('Unauthorized: No user or auth error')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()
    console.log('Profile lookup result:', profile)
    if (profileError) {
      console.log('Profile error:', profileError)
    }

    if (!profile?.is_admin) {
      console.log('Forbidden: User is not admin')
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'audio' or 'image'

    if (!file) {
      console.log('No file provided in formData')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (type === 'audio' && !file.type.startsWith('audio/')) {
      console.log('Invalid audio file type:', file.type)
      return NextResponse.json({ error: 'Invalid audio file type' }, { status: 400 })
    }

    if (type === 'image' && !file.type.startsWith('image/')) {
      console.log('Invalid image file type:', file.type)
      return NextResponse.json({ error: 'Invalid image file type' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${type}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`

    // Use service role client for storage operations to bypass RLS
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Upload to Supabase Storage using service role
    const { data, error } = await serviceClient.storage
      .from('episode-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = serviceClient.storage
      .from('episode-files')
      .getPublicUrl(fileName)

    return NextResponse.json({
      url: urlData.publicUrl,
      path: fileName,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 