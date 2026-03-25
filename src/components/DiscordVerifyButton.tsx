"use client";

import { createClient } from "@/utils/supabase/client";

export default function DiscordVerifyButton({ token }: { token: string }) {
  const supabase = createClient();

  const handleVerify = async () => {
    // 1. We lock the return path into local storage right here on the vote page
    if (typeof window !== "undefined") {
      localStorage.setItem("voteReturnPath", `/vote/${token}`);
    }

    // 2. We initiate the login and explicitly force the callback to return here
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/vote/${token}`,
      },
    });
  };

  return (
    <button
      onClick={handleVerify}
      className="inline-flex h-12 items-center justify-center rounded-md bg-white text-black px-8 font-bold transition-all hover:bg-zinc-200 active:scale-95"
    >
      Verify & Log In
    </button>
  );
}