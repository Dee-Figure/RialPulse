import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Activity, Plus, Users, Vote } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  // Securely fetch the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Count Active Campaigns
  const { count: activeCampaignsCount, error: campaignError } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)
    .eq("status", "ACTIVE");
  if (campaignError) console.error(" Campaign Error:", campaignError);

  // 2. Count Voting Circles
  const { count: votingCirclesCount, error: circlesError } = await supabase
    .from("voting-circles")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id);
  if (circlesError) console.error("🚨 Circles Error:", circlesError);

  // 3. Count Total Votes
  const { data: userCampaigns, error: fetchCampaignsError } = await supabase
    .from("campaigns")
    .select("id")
    .eq("created_by", user.id);
  if (fetchCampaignsError) console.error("🚨 Fetch Campaigns Error:", fetchCampaignsError);

  const campaignIds = userCampaigns?.map(c => c.id) || [];

  let totalVotesCount = 0;
  if (campaignIds.length > 0) {
    const { count, error: votesError } = await supabase
      .from("ballots")
      .select("*", { count: "exact", head: true })
      .in("campaign_id", campaignIds);
    if (votesError) console.error("🚨 Votes Error:", votesError);
    totalVotesCount = count || 0;
  }

  // 4. Fetch Recent Activity (Latest 5 campaigns created by this user)
  const { data: recentActivity, error: recentError } = await supabase
    .from("campaigns")
    .select("id, title, status, created_at")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false }) // Newest first
    .limit(5);

  if (recentError) {
    console.error("🚨 RECENT ACTIVITY ERROR:", recentError);
  }
  console.log("📝 RECENT ACTIVITY DATA:", recentActivity);

  console.log("📊 DASHBOARD STATS FOR USER:", user.id);
  console.log("Campaigns:", activeCampaignsCount, "| Circles:", votingCirclesCount, "| Votes:", totalVotesCount);
  console.log("Campaign IDs found:", campaignIds);

  // Extract Discord name and avatar
  const discordName = 
    user.user_metadata?.global_name || 
    user.user_metadata?.custom_claims?.global_name || 
    user.user_metadata?.full_name || 
    "Web3 Citizen";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex items-center space-x-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Discord Avatar"
              className="w-12 h-12 rounded-full border-2 border-black/10"
            />
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">Overview</h1>
            <p className="text-black/60 mt-1">
              Welcome back, <span className="font-bold text-black">{discordName}</span>
            </p>
          </div>
        </div>
        <Link href="/dashboard/campaigns" className="flex items-center justify-center space-x-2 bg-black text-[#ebe6dd] px-5 py-2.5 rounded-md font-medium hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md active:scale-95">
          <Plus size={18} />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-black/60 font-medium">Active Campaigns</span>
            <Vote className="text-black/40" size={20} />
          </div>
          <span className="text-3xl font-heading font-bold text-black">{activeCampaignsCount || 0}</span>
        </div>

        <div className="bg-white border border-black/10 p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-black/60 font-medium">Voting Circles</span>
            <Users className="text-black/40" size={20} />
          </div>
          <span className="text-3xl font-heading font-bold text-black">{votingCirclesCount || 0}</span>
        </div>

        <div className="bg-white border border-black/10 p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-black/60 font-medium">Total Votes Cast</span>
            <Activity className="text-black/40" size={20} />
          </div>
          <span className="text-3xl font-heading font-bold text-black">{totalVotesCount || 0}</span>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-black/10 px-6 py-4">
          <h2 className="font-medium text-black">Recent Campaigns</h2>
        </div>
        
        {/* 👇 THIS IS THE MAGIC IF/THEN STATEMENT */}
        {recentActivity && recentActivity.length > 0 ? (
          <div className="divide-y divide-black/5">
            {recentActivity.map((campaign) => (
              <Link 
                href={`/dashboard/campaigns/${campaign.id}`} 
                key={campaign.id} 
                className="p-4 sm:p-6 flex items-center justify-between hover:bg-black/[0.02] transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white transition-colors">
                    <Vote size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-black group-hover:underline decoration-black/20 underline-offset-4">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-black/50">
                      Launched on {new Date(campaign.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    campaign.status === "ACTIVE" 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State (Only shows if array is actually empty) */
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/30 mb-2">
              <Activity size={24} />
            </div>
            <p className="text-black/60">No recent activity found.</p>
            <Link href="/dashboard/campaigns/new" className="text-sm font-medium text-black underline underline-offset-4 hover:opacity-70 transition-opacity">
              Launch your first campaign
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}