"use client";

import { useState } from "react";
import { Wallet, CheckCircle2 } from "lucide-react";
import { connectWalletAddress } from "@/app/dashboard/settings/actions";

export default function WalletConnect({ existingAddress }: { existingAddress?: string | null }) {
  const [address, setAddress] = useState<string | null>(existingAddress || null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    // Check if a Web3 wallet extension is installed
    if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
      try {
        setIsConnecting(true);
        
        // Request the user's wallet address from their extension
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const walletAddress = accounts[0];

        // Send the address to our Supabase backend
        await connectWalletAddress(walletAddress);
        setAddress(walletAddress);
        
      } catch (error) {
        console.error("Connection failed", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask or a Rialo-compatible Web3 wallet to connect.");
    }
  };

  if (address) {
    return (
      <div className="flex items-center space-x-3 px-4 py-3 bg-green-50 text-green-800 border border-green-200 rounded-md font-medium text-sm">
        <CheckCircle2 size={18} />
        <span>Linked: {address.slice(0, 6)}...{address.slice(-4)}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      type="button"
      className="flex items-center justify-center w-full sm:w-auto space-x-3 px-6 py-3 bg-black text-[#ebe6dd] rounded-md font-medium text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50 active:scale-[0.98]"
    >
      <Wallet size={18} />
      <span>{isConnecting ? "Connecting..." : "Connect Web3 Wallet"}</span>
    </button>
  );
}
