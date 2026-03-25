"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VoteRedirector() {
  const router = useRouter();

  useEffect(() => {
    // 1. Check their pocket for the sticky note
    const returnPath = localStorage.getItem("voteReturnPath");
    
    // 2. If it exists AND it's a vote page, teleport them!
    if (returnPath && returnPath.startsWith("/vote/")) {
      // Throw the sticky note away so it doesn't loop forever
      localStorage.removeItem("voteReturnPath");
      
      // Instantly push them to the password screen
      router.push(returnPath);
    }
  }, [router]);

  return null; // This component is completely invisible
}