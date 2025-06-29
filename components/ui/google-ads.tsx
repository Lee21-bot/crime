'use client'

import { useEffect } from 'react'

// Extend Window interface for Google AdSense
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface GoogleAdProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'banner' | 'sidebar'
  className?: string
  style?: React.CSSProperties
}

export function GoogleAd({ adSlot, adFormat = 'auto', className = '', style = {} }: GoogleAdProps) {
  useEffect(() => {
    // Load Google AdSense script if not already loaded
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script')
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID'
      script.async = true
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }

    // Push the ad to Google AdSense
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('Error loading Google Ad:', error)
      }
    }
  }, [adSlot])

  return (
    <div className={`google-ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Predefined ad components for different positions
export function HeaderBannerAd() {
  return (
    <GoogleAd
      adSlot="1234567890"
      adFormat="banner"
      className="w-full h-[90px] bg-gray-800 rounded-lg mb-6 flex items-center justify-center"
      style={{ minHeight: '90px' }}
    />
  )
}

export function SidebarAd() {
  return (
    <GoogleAd
      adSlot="0987654321"
      adFormat="rectangle"
      className="w-full bg-gray-800 rounded-lg mb-4"
      style={{ minHeight: '250px' }}
    />
  )
}

export function ContentAd() {
  return (
    <GoogleAd
      adSlot="1122334455"
      adFormat="rectangle"
      className="w-full bg-gray-800 rounded-lg my-6"
      style={{ minHeight: '250px' }}
    />
  )
}

export function FooterBannerAd() {
  return (
    <GoogleAd
      adSlot="5566778899"
      adFormat="banner"
      className="w-full h-[90px] bg-gray-800 rounded-lg mt-6 flex items-center justify-center"
      style={{ minHeight: '90px' }}
    />
  )
}

// Ad wrapper that shows/hides based on membership
interface ConditionalAdProps {
  children: React.ReactNode
  showForFreeUsers?: boolean
  showForInvestigators?: boolean
  userMembership?: string | null
}

export function ConditionalAd({ 
  children, 
  showForFreeUsers = true, 
  showForInvestigators = false,
  userMembership = null 
}: ConditionalAdProps) {
  const shouldShow = 
    (showForFreeUsers && !userMembership) || 
    (showForInvestigators && userMembership === 'investigator')

  if (!shouldShow) {
    return null
  }

  return <>{children}</>
} 