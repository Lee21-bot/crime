# ShadowFiles/Crime (Stable Snapshot)

**Stable Commit:** Profile update, chat UI, and RLS fixes (June 26, 2025)

This commit is a stable restore point before further chat UI enhancements. Use this as a safe fallback if you need to revert any future changes.

## What Works
- User profile display name can be updated from the dashboard (with proper RLS and upsert conflict handling)
- Chat UI is functional with channel switching, colored avatars, and message timestamps
- Auth, membership, and dashboard flows are stable
- Supabase RLS policies for `user_profiles` are set up correctly

## What Was Fixed
- Fixed missing `display_name` column in `user_profiles`
- Fixed duplicate key errors on profile update by specifying `onConflict: 'user_id'` in upsert
- Added/updated RLS policies for user profile editing
- Improved chat UI and message display

---

_You can safely experiment with further chat UI improvements from this point._

# ShadowFiles - True Crime Community

A premium Next.js application for true crime enthusiasts featuring exclusive case files, member-only chat, audio narration, and subscription-based access tiers.

![ShadowFiles Banner](https://via.placeholder.com/1200x400/0F0F23/FFD700?text=ShadowFiles+True+Crime+Community)

## 🔍 Project Overview

ShadowFiles is a comprehensive true crime community platform that provides:

- **Curated Case Files**: Detailed investigations of history's most compelling mysteries
- **Audio Narration**: Professional voice narration using ElevenLabs AI
- **Member Chat**: Real-time discussions for paid subscribers
- **Tiered Access**: Free and premium membership levels
- **Modern UI**: Dark theme with crime scene aesthetics

## ✨ Features

### Core Features
- 🕵️ **Case File Archive**: Browse and search through curated true crime cases
- 🎧 **Audio Narration**: Listen to professionally narrated case files
- 💬 **Member Chat**: Exclusive real-time discussions for premium members
- 👥 **Membership Tiers**: Free visitor access and premium investigator membership
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile

### Technical Features
- ⚛️ **Next.js 14**: App Router, Server Components, and TypeScript
- 🎨 **Tailwind CSS**: Custom design system with true crime theming
- 🔐 **Supabase**: Authentication and real-time database
- 💳 **Stripe**: Subscription payment processing
- 🗣️ **ElevenLabs**: AI-powered text-to-speech narration
- 🔒 **Middleware**: Route protection based on membership tier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shadowfiles-community.git
   cd shadowfiles-community
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key-here
   STRIPE_SECRET_KEY=your-stripe-secret-key-here
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret-here

   # ElevenLabs Configuration
   ELEVENLABS_API_KEY=your-elevenlabs-api-key-here

   # App Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
shadowfiles-community/
├── app/                    # Next.js App Router
│   ├── case-files/        # Case file routes
│   │   ├── [slug]/        # Individual case pages
│   │   └── page.tsx       # Case files listing
│   ├── membership/        # Subscription management
│   ├── chat/              # Member-only chat (future)
│   ├── admin/             # Admin panel (future)
│   └── api/               # API routes (future)
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   ├── case-files/       # Case-specific components
│   ├── chat/             # Chat components
│   └── membership/       # Subscription components
├── lib/                  # Utility functions
│   ├── subscription/     # Membership logic
│   ├── case-files/       # Case processing
│   ├── chat/             # Real-time chat
│   ├── audio/            # ElevenLabs integration
│   └── supabase.ts       # Database client
├── types/                # TypeScript definitions
├── providers/            # React context providers
├── hooks/                # Custom React hooks
├── middleware.ts         # Route protection
└── public/               # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary Background**: `#0F0F23` (Deep midnight)
- **Secondary Background**: `#1A1A2E` (Secondary dark)
- **Tertiary Background**: `#232337` (Card backgrounds)
- **Accent Yellow**: `#FFD700` (Police tape)
- **Accent Red**: `#DC2626` (Crime scene red)
- **Accent Orange**: `#FB923C` (Evidence markers)

### Typography
- **Display Font**: Inter + Roboto Mono
- **Body Font**: Inter + system-ui
- **Monospace Font**: Roboto Mono

### Animations
- **Police Tape**: Floating animation for header
- **Evidence Markers**: Glowing effect for interactive elements
- **Message Slide-in**: Smooth animations for chat messages

## 💳 Membership Tiers

### Visitor (Free)
- Browse public case files
- Read case summaries
- View featured cases

### Investigator ($5/month)
- Access to member chat
- Full case files with details
- Audio narration of cases
- Community discussions
- Download case file PDFs

## 🔐 Database Schema

### Core Tables
```sql
-- User subscriptions
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  stripe_subscription_id TEXT,
  status TEXT,
  tier TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Case files
CREATE TABLE case_files (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  summary TEXT,
  content TEXT,
  status TEXT,
  difficulty_level TEXT,
  required_tier TEXT,
  created_at TIMESTAMP
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  channel_id TEXT,
  user_id UUID,
  content TEXT,
  created_at TIMESTAMP
);
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in the Vercel dashboard
3. **Deploy** automatically on git push

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🔧 API Integrations

### Supabase
- User authentication and authorization
- Real-time database for chat and subscriptions
- Row Level Security (RLS) for data protection

### Stripe
- Subscription payment processing
- Customer portal for subscription management
- Webhook handling for subscription events

### ElevenLabs
- AI-powered text-to-speech narration
- Multiple voice profiles for different case types
- Audio file generation and caching

## 📝 Development Roadmap

### Phase 1: Foundation ✅
- [x] Next.js 14 setup with TypeScript
- [x] Tailwind CSS design system
- [x] Basic routing and layout
- [x] Case files system with mock data
- [x] Membership pages

### Phase 2: Authentication & Payments ✅
- [x] Supabase authentication setup
- [x] User registration and login system
- [x] Authentication context and providers
- [x] User dashboard and profile management
- [x] Protected routes middleware
- [x] Navigation with authentication states
- [ ] Stripe subscription integration

### Phase 3: Real-time Features
- [ ] Supabase Realtime chat system
- [ ] Member-only chat channels
- [ ] Online presence indicators
- [ ] Chat moderation tools

### Phase 4: Audio & Enhancement
- [ ] ElevenLabs audio generation
- [ ] Audio player components
- [ ] Case file audio narration
- [ ] Audio caching system

### Phase 5: Admin & Content
- [ ] Admin dashboard
- [ ] Case file management system
- [ ] User management tools
- [ ] Analytics and reporting

### Phase 6: Polish & Launch
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Testing and QA
- [ ] Production deployment

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run e2e tests:
```bash
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- True crime community for inspiration
- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Stripe for payment processing
- ElevenLabs for AI narration technology

## 📞 Support

For support, email support@shadowfiles.community or join our Discord community.

---

**ShadowFiles - Uncover the Truth** 🕵️‍♂️

## Google AdSense Setup

To enable Google AdSense for free tier users:

1. **Get your Publisher ID** from Google AdSense
2. **Add environment variable**:
   ```bash
   NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-YOUR_ACTUAL_PUBLISHER_ID
   ```
3. **Create ad units** in Google AdSense for these slots:
   - `banner-ad-slot` (728x90)
   - `inline-ad-slot` (300x250)
   - `sidebar-ad-slot` (300x250)
   - `leaderboard-ad-slot` (728x90)

### Ad Placement

- **Case Files Listing**: Banner ad at top, inline ad after first 6 case files
- **Individual Case Files**: Inline ads before and after content
- **Free Users Only**: Ads are automatically hidden for paid subscribers

## Business Model

- **Free Tier**: Access to case stories with Google ads
- **Investigator Tier**: Ad-free experience + full chat access + color personalization

## Tech Stack

- **Frontend**: Next.js 14/15 with TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Ads**: Google AdSense

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Google AdSense
NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-your_publisher_id
```

## Database Setup

Run the SQL migrations in `supabase/migrations/` to set up the database schema.

## Deployment

The app is configured for deployment on Vercel with automatic database migrations.

## Account Settings (Coming Soon)

A dedicated Account Settings page will be available for users to manage their account and preferences. Planned features include:

- **Change Password / Email:** Update your login credentials securely.
- **Manage Connected Accounts (OAuth):** Link or unlink Google, GitHub, and other providers.
- **Notification Preferences:** Control which email or in-app notifications you receive.
- **Privacy/Security Options:** Manage visibility, two-factor authentication, and other privacy settings.
- **Delete Account:** Permanently remove your account and data.
- **Billing/Subscription Management:** View and manage your membership, payment methods, and invoices (existing membership page will be integrated).

This page will be accessible from your dashboard and will consolidate all user account management features in one place.
