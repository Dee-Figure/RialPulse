# <img src="./public/logo.png" alt="RialPulse Logo" width="25"/> RialPulse


**The Web2.5 Governance & Proof of Participation Platform.**
Built for the Rialo Ecosystem Hackathon.

RialPulse is a trustless,fully auditable voting platform designed to enhance genuine community participation while defending against Sybil attacks. RialPulse eliminate Web3 onboarding barriers by combining frictionless Discord authentication with native wallet recognition,allowing anyone to securely make their voice heard. 

At its core, RialPulse replaces capital-weighted voting (1 Token = 1 Vote) with a gamified Reputation Engine. Users earn off-chain reputation points by actively engaging in ecosystem quests and voting on dynamic campaigns,preparing them for V2 on-chain Soulbound Token (SBT) minting.

##  Key Features
* **Frictionless Pseudonymous Auth:** One-click login via Discord OAuth. No passwords, no doxxing.
* **Web3 Identity Bridging:** Native `window.ethereum` integration allowing users to securely bind their cryptographic wallet address to their profile.
* **Gamified Reputation Engine:** A built-in system that rewards users with XP for ecosystem engagement.
* **Dynamic Campaign Builder:** Creators can deploy custom governance proposals with flexible, unlimited voting options arrayed dynamically.
* **Secure Voting Infrastructure:** Real-time ballot casting with Row Level Security (RLS) ensuring one-vote-per-user integrity.
* **Real-Time Data Visualization:** Live, automatically calculating progress bars for active campaign results.

## 🛠 Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Supabase (PostgreSQL, Row Level Security)
* **Authentication:** Supabase Auth (Discord OAuth Provider)
* **Blockchain:** Native Web3 Browser Provider injection
* **Hosting:** Vercel

---

##  Getting Started (Local Development)

### Prerequisites
* Node.js (v18+)
* A Supabase Account
* A Discord Developer Application (for OAuth credentials)

## 1. Clone the repository

```bash
git clone [https://github.com/your-username/rial-pulse.git](https://github.com/your-username/rial-pulse.git)
cd rial-pulse
```

## 2. Install dependencies

```bash
npm install
```
## 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Database Setup
Execute the following schema updates in your Supabase SQL Editor to initialize the RialPulse architecture:
```bash
-- Add Reputation & Web3 Identity to Users
ALTER TABLE public.users 
ADD COLUMN reputation_points INTEGER DEFAULT 0,
ADD COLUMN claimed_quests TEXT[] DEFAULT '{}',
ADD COLUMN wallet_address TEXT UNIQUE;

-- Enable Dynamic Options in Campaigns
ALTER TABLE public.campaigns 
ADD COLUMN options TEXT[] DEFAULT '{}';

-- Update Ballots to accept dynamic text
ALTER TABLE public.ballots 
ADD COLUMN selected_option TEXT;
``` 
## 5. Run the development server
```bash

npm run dev
```
Open http://localhost:3000 with your browser to see the result.

## 🗺 Roadmap (V2 Mainnet)

*  **On-Chain Reputation Minting:** Automatic translation of Supabase `reputation_points` to Rialo Network Soulbound Tokens (SBTs).
*  **Token-Gated Campaigns:** Allow creators to restrict voting access based on minimum on-chain reputation scores or specific NFT holdings.
*  **Treasury Execution:** Smart contract integration to automatically execute treasury payouts based on the winning option of a RialPulse campaign.
