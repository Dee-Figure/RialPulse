import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden bg-[#ebe6dd] font-sans">
      
      {/* Subtle Infrastructure Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Top Navigation Bar with your Logo */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Automatically loads public/logo.png */}
          <img 
            src="/logo.png" 
            alt="RialPulse Logo" 
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <span className="font-heading font-bold text-2xl tracking-tight text-black">RialPulse</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black/60">
          <Link href="/dashboard" className="hover:text-black transition-colors">Platform</Link>
          <Link href="#" className="hover:text-black transition-colors">Documentation</Link>
          <Link 
            href="/login" 
            className="text-black bg-black/5 px-5 py-2 rounded-full hover:bg-black/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-5xl px-6 text-center -mt-10 md:-mt-20">
        
        {/* Top Announcement Pill */}
        <div className="mb-8 inline-flex items-center rounded-full border border-black/10 bg-white/40 px-6 py-2 text-sm font-medium backdrop-blur-sm shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-3 animate-pulse"></span>
          RialPulse V1 is Live on Testnet
        </div>

        {/* Massive Typography */}
        <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tighter text-black mb-6 leading-[1.05]">
          Institutional governance for <span className="text-black/30">Rialo builders</span>
        </h1>
        
        {/* The Pitch / Intro */}
        <p className="text-lg md:text-2xl text-black/60 max-w-3xl mx-auto font-sans mb-12 tracking-tight">
          The definitive coordination engine for the Rialo ecosystem. Deploy secure, programmable voting campaigns with enterprise-grade access controls in seconds.
        </p>

        {/* Modern Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard" 
            className="group relative flex h-14 items-center justify-center overflow-hidden rounded-full bg-black px-8 font-medium text-[#ebe6dd] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
          >
            Launch Platform
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            href="/login" 
            className="flex h-14 items-center justify-center rounded-full border border-black/20 bg-transparent px-8 font-medium text-black transition-colors hover:bg-black/5 hover:border-black/40"
          >
            Organization Login
          </Link>
        </div>

        {/* Bottom Network Stats (Tailored for the Rialo pitch) */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-black/10 pt-12 w-full max-w-4xl">
           <div className="flex flex-col items-center">
             <span className="text-4xl md:text-5xl font-bold font-heading text-black tracking-tighter">100%</span>
             <span className="text-sm font-medium text-black/50 mt-2 uppercase tracking-widest text-center">On-Chain Ready</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-4xl md:text-5xl font-bold font-heading text-black tracking-tighter">Role</span>
             <span className="text-sm font-medium text-black/50 mt-2 uppercase tracking-widest text-center">Based Access</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-4xl md:text-5xl font-bold font-heading text-black tracking-tighter">B2B</span>
             <span className="text-sm font-medium text-black/50 mt-2 uppercase tracking-widest text-center">Architecture</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-4xl md:text-5xl font-bold font-heading text-black tracking-tighter">Edge</span>
             <span className="text-sm font-medium text-black/50 mt-2 uppercase tracking-widest text-center">Server Latency</span>
           </div>
        </div>

      </main>
    </div>
  );
}