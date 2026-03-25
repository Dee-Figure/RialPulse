"use client";

import { createClient } from "@/utils/supabase/client";

export default function DiscordVerifyButton({ token }: { token: string }) {
  const supabase = createClient();

  const handleVerify = async () => {
    // 1. Write the Sticky Note (Save the exact voting page link to memory)
    if (typeof window !== "undefined") {
      localStorage.setItem("voteReturnPath", `/vote/${token}`);
    }

    // 2. Send them to Discord with a clean, parameter-free URL
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={handleVerify}
      className="inline-flex h-12 items-center justify-center rounded-md bg-[#5865F2] text-white px-8 font-bold transition-all hover:bg-[#4752C4] active:scale-95 mt-4"
    >
      Verify with Discord
    </button>
  );
}