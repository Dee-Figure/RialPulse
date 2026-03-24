import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const campaignId = resolvedParams.id;
  const supabase = await createClient();

  // Grab the currently logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch the campaign
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  // 2. Fetch all the votes (ballots) for this specific campaign
  const { data: ballots } = await supabase
    .from("ballots")
    .select("selected_option")
    .eq("campaign_id", campaignId);

  if (!campaign) notFound();

  // 3. The Counting Engine
  const totalVotes = ballots?.length || 0;
  
  // Initialize an object with all options set to 0 votes
  const voteResults: Record<string, number> = {};
  const options = campaign.options || [];
  options.forEach((opt: string) => {
    voteResults[opt] = 0;
  });

  // Tally up the actual votes
  ballots?.forEach((ballot) => {
    if (ballot.selected_option && voteResults[ballot.selected_option] !== undefined) {
      voteResults[ballot.selected_option] += 1;
    }
  });

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

      {/* --- SECURE ADMIN LINK BLOCK --- */}
      {/* This ONLY renders if the person viewing the page is the person who created it */}
      {user?.id === campaign.created_by && (
        <div className="bg-[#e5e3db] p-4 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h3 className="font-bold text-black">Public Voting Link</h3>
            <p className="text-sm text-gray-600">Share this link with your community to collect votes.</p>
          </div>
          <div className="bg-white px-4 py-3 rounded-md border font-mono text-sm text-black break-all select-all">
            {/* This fixes the localhost issue by checking for your Vercel URL dynamically */}
            {process.env.NEXT_PUBLIC_SITE_URL || 'https://rial-pulse.vercel.app'}/vote/{campaign.id}
          </div>
        </div>
      )}
      {/* ------------------------------- */}

      {/* --- DYNAMIC RESULTS SECTION --- */}
      <div className="mt-8 bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h3 className="text-xl font-bold text-black">Live Results</h3>
          <div className="bg-black/5 px-3 py-1 rounded-full text-sm font-bold text-black">
            {totalVotes} Total Votes
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(voteResults).map(([optionName, voteCount]) => {
            // Calculate the percentage (safeguard against dividing by zero)
            const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

            return (
              <div key={optionName} className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-gray-800">
                  <span>{optionName}</span>
                  <span>{voteCount} votes ({percentage}%)</span>
                </div>
                
                {/* The Progress Bar Track */}
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  {/* The Fill */}
                  <div 
                    className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* -------------------------------- */}
    </div>
  );
}