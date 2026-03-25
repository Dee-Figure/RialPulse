import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Info, Lock, ChevronRight } from "lucide-react";
import { submitVote, unlockCampaign } from "./actions";

export default async function VotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = await params;
  const token = resolvedParams.token;
  const supabase = await createClient();

  // 1. Fetch the Campaign
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, title, description, status, is_public, organizations(name), options, voting_password")
    .eq("id", token)
    .single();

  if (!campaign) notFound();

  // Fallback to empty array if no options exist
  const votingOptions = campaign.options || [];

  // 3. Check if the user is logged in, and if they have already voted
  const { data: { user } } = await supabase.auth.getUser();
  let existingVote = null;

  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get(`unlocked_${token}`)?.value === "true";

  // A campaign is locked ONLY if it has a password AND the user hasn't unlocked it yet
  const hasPassword = campaign.voting_password !== null && campaign.voting_password !== "";
  const isLocked = hasPassword && !isUnlocked;

  if (user) {
    // Fetch the existing vote
    const { data: ballot } = await supabase
      .from("ballots")
      .select("created_at, selected_option")
      .eq("campaign_id", campaign.id)
      .eq("user_id", user.id)
      .single();
    
    existingVote = ballot;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-rialo-cream p-4 relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="w-full max-w-2xl bg-white border border-black/10 rounded-2xl shadow-xl p-8 relative z-10">
        
        <div className="flex items-center space-x-2 text-sm font-medium text-black/50 mb-6">
          <div className="w-6 h-6 rounded bg-black/5 flex items-center justify-center">
            <Lock size={12} className="text-black/60" />
          </div>
          <span>Hosted by {(campaign.organizations as any)?.name || "an Organization"}</span>
        </div>

        <div className="mb-10 space-y-4">
          <h1 className="font-heading text-4xl font-bold tracking-tighter text-black leading-tight">
            {campaign.title}
          </h1>
          <p className="text-lg text-black/60 leading-relaxed">
            {campaign.description}
          </p>
        </div>

        {campaign.status !== "ACTIVE" ? (
          <div className="bg-black/5 rounded-xl p-6 text-center border border-black/10">
            <Info className="mx-auto mb-2 text-black/50" size={24} />
            <h3 className="font-medium text-black">Voting is closed</h3>
            <p className="text-sm text-black/50 mt-1">This campaign is no longer accepting new ballots.</p>
          </div>

        ) : !user || user.app_metadata.provider !== 'discord' ? (
          
          <div className="bg-black text-rialo-cream rounded-xl p-8 text-center shadow-lg">
            <Lock className="mx-auto mb-4 text-rialo-cream/60" size={32} />
            <h3 className="text-xl font-heading font-bold mb-2">Authentication Required</h3>
            <p className="text-rialo-cream/70 mb-6 max-w-sm mx-auto">
              To prevent duplicate votes, you must verify your identity to participate in this campaign.
            </p>
            <Link 
              href="/login" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-white text-black px-8 font-bold transition-all hover:bg-zinc-200 active:scale-95"
            >
              Verify & Log In
            </Link>
          </div>

        ) : isLocked ? (
          <div className="bg-white rounded-xl p-8 text-center border shadow-lg">
            <Lock className="mx-auto mb-4 text-black/60" size={32} />
            <h3 className="text-xl font-bold mb-2">Campaign Locked</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              You are verified! Now, please enter the campaign password to view the voting options.
            </p>
            <form action={unlockCampaign} className="space-y-4">
              <input type="hidden" name="token" value={token} />
              <input
                type="password"
                name="password"
                required
                placeholder="Enter voting password"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="w-full bg-black text-rialo-cream rounded-md px-8 py-3 font-bold hover:bg-zinc-800 transition-colors"
              >
                Unlock Campaign
              </button>
            </form>
          </div>

        ) : existingVote ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle2 className="mx-auto mb-2 text-green-600" size={32} />
            <h3 className="font-bold text-green-900 text-lg">Your vote is secured</h3>
            <p className="text-sm text-green-700 mt-2">
              You voted for: <br/>
              <span className="font-bold text-lg block mt-1">
                {existingVote?.selected_option}
              </span>
            </p>
            <p className="text-xs text-green-600/70 mt-3">
              Recorded on {new Date(existingVote?.created_at ?? "").toLocaleString()}
            </p>
          </div>
        ) : (
          <form action={submitVote} className="space-y-6">
            {/* Hidden input to pass the campaign ID to the server action */}
            <input type="hidden" name="token" value={token} />

            <div className="space-y-3">
              {/* 2. Map through the dynamic array to create the choices */}
              {votingOptions.map((option: string, index: number) => (
                <label 
                  key={index} 
                  className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors has-checked:border-black has-checked:bg-black/5 has-checked:ring-1 has-checked:ring-black"
                >
                  <input 
                    type="radio" 
                    name="selectedOption" // All radio buttons must share the same name
                    value={option}        // The value sent to the database
                    required
                    className="w-5 h-5 text-black border-gray-300 focus:ring-black" 
                  />
                  <span className="ml-3 font-medium text-gray-900">{option}</span>
                </label>
              ))}
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-black text-rialo-cream rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors flex justify-center items-center"
            >
              <CheckCircle2 className="mr-2" size={20} />
              Cast My Vote
            </button>
          </form>
        )}
      </div>
    </div>
  );
}