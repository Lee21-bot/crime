import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from '../providers/client-providers'
import { Navigation } from '../components/layout/navigation'
import Script from 'next/script'

const crimsonPro = Crimson_Pro({ 
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson-pro"
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "ShadowFiles - True Crime Community",
  description: "Premium true crime community with exclusive case files, member chat, and audio narration",
  keywords: "true crime, crime community, case files, investigation, mystery",
  authors: [{ name: "ShadowFiles Team" }],
  creator: "ShadowFiles",
  publisher: "ShadowFiles",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://shadowfiles-community.vercel.app"),
  openGraph: {
    title: "ShadowFiles - True Crime Community",
    description: "Premium true crime community with exclusive case files, member chat, and audio narration",
    url: "https://shadowfiles-community.vercel.app",
    siteName: "ShadowFiles",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadowFiles - True Crime Community",
    description: "Premium true crime community with exclusive case files, member chat, and audio narration",
    creator: "@shadowfiles",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID || 'ca-pub-YOUR_PUBLISHER_ID'}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${crimsonPro.variable} ${inter.variable} font-serif min-h-screen bg-bg-primary text-text-primary antialiased`}>
        <ClientProviders>
          <div className="relative min-h-screen overflow-hidden">
            {/* Background crime scene effect with blur */}
            <div className="fixed inset-0 bg-crime-gradient pointer-events-none" />
            
            {/* Multiple floating crime scene tapes */}
            <div className="fixed inset-0 pointer-events-none z-5">
              <div className="crime-tape-layer tape-1"></div>
              <div className="crime-tape-layer tape-3"></div>
            </div>
            
            {/* Navigation with blur */}
            <div className="relative z-20">
              <Navigation />
            </div>
            
            {/* Main content with glass effect */}
            <main className="relative z-10">
              <div className="backdrop-blur-sm bg-bg-secondary/10">
                {children}
              </div>
            </main>
          
            {/* Footer */}
            <footer className="relative z-10 border-t border-border-primary bg-bg-secondary/80 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <div className="font-display font-bold text-2xl flex">
                      <span className="!text-red-500 !important">Shadow</span>
                      <span className="text-accent-yellow">Files</span>
                    </div>
                    <span className="text-text-muted">|</span>
                    <span className="text-text-secondary">True Crime Community</span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-text-muted">
                    <span>© 2024 ShadowFiles</span>
                    <span>•</span>
                    <span>Premium Crime Investigation</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
