export const dynamic = "force-dynamic";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Info, Lock, ChevronRight } from "lucide-react";
import { castVote } from "./actions";

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
    .select("id, title, description, status, is_public, organizations(name)")
    .eq("share_token", token)
    .single();

  if (!campaign) notFound();

  // 2. Fetch the dynamic options for this campaign
  const { data: options } = await supabase
    .from("campaign_options")
    .select("id, option_text")
    .eq("campaign_id", campaign.id)
    .order("created_at", { ascending: true });

  // 3. Check if the user is logged in, and if they have already voted
  const { data: { user } } = await supabase.auth.getUser();
  let existingVote = null;

  if (user) {
    // Notice we fetch the joined campaign_options table to get the text they voted for
    const { data: ballot } = await supabase
      .from("ballots")
      .select("created_at, campaign_options(option_text)")
      .eq("campaign_id", campaign.id)
      .eq("user_id", user.id)
      .single();
    
    existingVote = ballot;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ebe6dd] p-4 relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

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
        ) : !user ? (
          <div className="bg-black text-[#ebe6dd] rounded-xl p-8 text-center shadow-lg">
            <Lock className="mx-auto mb-4 text-[#ebe6dd]/60" size={32} />
            <h3 className="text-xl font-heading font-bold mb-2">Authentication Required</h3>
            <p className="text-[#ebe6dd]/70 mb-6 max-w-sm mx-auto">
              To prevent duplicate votes, you must verify your identity to participate in this campaign.
            </p>
            <Link 
              href="/login" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-white text-black px-8 font-bold transition-all hover:bg-zinc-200 active:scale-95"
            >
              Verify & Log In
            </Link>
          </div>
        ) : existingVote ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle2 className="mx-auto mb-2 text-green-600" size={32} />
            <h3 className="font-bold text-green-900 text-lg">Your vote is secured</h3>
            <p className="text-sm text-green-700 mt-2">
              You voted for: <br/>
              <span className="font-bold text-lg block mt-1">
                {/* @ts-ignore - Supabase join typing can be tricky here */}
                {existingVote.campaign_options?.option_text}
              </span>
            </p>
            <p className="text-xs text-green-600/70 mt-3">
              Recorded on {new Date(existingVote.created_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <form action={castVote} className="space-y-3">
            <input type="hidden" name="token" value={token} />
            
            {/* Dynamically Loop Through Custom Options */}
            {options?.map((opt) => (
              <button
                key={opt.id}
                type="submit"
                name="option_id"
                value={opt.id}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-black/10 bg-white p-5 text-left transition-all hover:border-black hover:bg-black/5 hover:shadow-md active:scale-[0.99]"
              >
                <span className="font-bold text-lg text-black">{opt.option_text}</span>
                <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </form>
        )}
      </div>
    </div>
  );
}