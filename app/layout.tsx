import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../providers/auth-provider'
import { Navigation } from '../components/layout/navigation'

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
      <body className={`${crimsonPro.variable} ${inter.variable} font-serif min-h-screen bg-bg-primary text-text-primary antialiased`}>
        <AuthProvider>
          <div className="relative min-h-screen">
            {/* Background crime scene effect */}
            <div className="fixed inset-0 bg-crime-gradient pointer-events-none" />
            
            {/* Multiple floating crime scene tapes */}
            <div className="fixed inset-0 pointer-events-none z-5">
              <div className="crime-tape-layer tape-1"></div>
              <div className="crime-tape-layer tape-2"></div>
              <div className="crime-tape-layer tape-3"></div>
            </div>
            
            {/* Police tape header */}
            <div className="police-tape animate-floating-tape relative z-10" />
            
            {/* Navigation */}
            <Navigation />
            
            {/* Main content */}
            <main className="relative z-10">
              {children}
            </main>
          
          {/* Footer */}
          <footer className="relative z-10 border-t border-border-primary bg-bg-secondary/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <span className="text-accent-yellow font-display font-bold text-xl">
                    ShadowFiles
                  </span>
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
        </AuthProvider>
      </body>
    </html>
  );
}
