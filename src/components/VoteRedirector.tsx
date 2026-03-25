"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VoteRedirector() {
  const router = useRouter();

  useEffect(() => {
    // 1. Check if the user has a hidden voting ticket
    const returnPath = localStorage.getItem("voteReturnPath");
    
    if (returnPath && returnPath !== "/dashboard") {
      // 2. Delete it so they don't get stuck in a loop later
      localStorage.removeItem("voteReturnPath");
      
      // 3. Teleport them instantly to the locked campaign!
      router.push(returnPath);
    }
  }, [router]);

  return null; // This component renders nothing on the screen
}