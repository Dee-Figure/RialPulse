import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, CheckCircle2, XCircle, Activity } from "lucide-react";

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const campaignId = resolvedParams.id;
  const supabase = await createClient();

  // 1. Fetch the campaign details
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (!campaign) notFound();

  // 2. Fetch all ballots cast for this campaign
  const { data: ballots } = await supabase
    .from("ballots")
    .select("choice, weight_used")
    .eq("campaign_id", campaignId);

  // 3. Calculate Results
  const totalVotes = ballots?.length || 0;
  const yesVotes = ballots?.filter((b) => b.choice === true).length || 0;
  const noVotes = ballots?.filter((b) => b.choice === false).length || 0;

  const yesPercentage = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
  const noPercentage = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <Link href="/dashboard/campaigns" className="inline-flex items-center text-sm font-medium text-black/50 hover:text-black transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Campaigns
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">{campaign.title}</h1>
            <p className="text-black/60 mt-2 max-w-2xl">{campaign.description}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
            {campaign.status}
          </span>
        </div>
      </div>

      {/* Secret Share Link Card */}
      <div className="bg-black/5 border border-black/10 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-black">Public Voting Link</h3>
          <p className="text-sm text-black/60">Share this link with your community to collect votes.</p>
        </div>
        <div className="bg-white border border-black/10 rounded-md px-4 py-2 text-sm font-mono text-black/80 select-all w-full sm:w-auto truncate max-w-xs">
          localhost:3000/vote/{campaign.share_token}
        </div>
      </div>

      {/* Live Results Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Turnout */}
        <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="text-black/60 font-bold uppercase tracking-wider text-sm">Total Turnout</span>
            <Users className="text-black/40" size={20} />
          </div>
          <span className="text-5xl font-heading font-bold text-black">{totalVotes}</span>
        </div>

        {/* YES Votes */}
        <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
            <span className="text-black/60 font-bold uppercase tracking-wider text-sm">Yes Votes</span>
            <CheckCircle2 className="text-green-500" size={20} />
          </div>
          <div>
            <span className="text-4xl font-heading font-bold text-black">{yesVotes}</span>
            <div className="w-full bg-black/5 rounded-full h-2 mt-3">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${yesPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* NO Votes */}
        <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
            <span className="text-black/60 font-bold uppercase tracking-wider text-sm">No Votes</span>
            <XCircle className="text-red-500" size={20} />
          </div>
          <div>
            <span className="text-4xl font-heading font-bold text-black">{noVotes}</span>
            <div className="w-full bg-black/5 rounded-full h-2 mt-3">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${noPercentage}%` }}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}