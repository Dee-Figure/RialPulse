"use client";

import { useState, useTransition } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { claimQuest } from "./actions";

export default function ClaimButton({ questId, points }: { questId: string, points: number }) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClaim = () => {
    setErrorMsg(null); 
    
    const formData = new FormData();
    formData.append("questId", questId);
    formData.append("points", points.toString());

    startTransition(async () => {
      const result = await claimQuest(formData);
      
      if (result?.error) {
        setErrorMsg(result.error);
      }
    });
  };

  return (
    <div className="space-y-3 mt-4">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 text-xs font-bold p-2.5 rounded flex items-start border border-red-100 animate-in fade-in zoom-in duration-300">
          <AlertCircle size={14} className="mr-1.5 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button 
        onClick={handleClaim}
        disabled={isPending}
        className="w-full py-2.5 rounded-md bg-black text-[#ebe6dd] font-bold text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Verifying..." : "Verify & Claim"}
        {!isPending && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
      </button>
    </div>
  );
}