import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Globe, Vote, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ExplorePage() {
  const supabase = await createClient();

  // 1. Fetch ALL active campaigns where is_public is TRUE
  const { data: publicCampaigns, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_public", true)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false }); // Newest first!

  if (error) {
    console.error("Error fetching public campaigns:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-black/10 pb-6">
        <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black">
          <Globe size={24} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">Explore</h1>
          <p className="text-black/60 mt-1">Discover and participate in public community campaigns.</p>
        </div>
      </div>

      {/* The Feed */}
      {publicCampaigns && publicCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                  <Vote className="text-black/30" size={20} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2 line-clamp-1">{campaign.title}</h3>
                <p className="text-black/60 text-sm mb-6 line-clamp-2">
                  {campaign.description || "No description provided."}
                </p>
              </div>
              
              <Link 
                href={`/vote/${campaign.id}`}
                className="w-full inline-flex items-center justify-center bg-black/5 hover:bg-black hover:text-[#ebe6dd] text-black font-medium py-2.5 rounded-md transition-colors"
              >
                <span>View & Vote</span>
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-black/10 rounded-xl p-12 text-center shadow-sm">
          <Globe className="mx-auto mb-4 text-black/20" size={48} />
          <h3 className="text-xl font-bold text-black mb-2">No public campaigns yet</h3>
          <p className="text-black/50 max-w-sm mx-auto">
            When creators launch public voting campaigns, they will appear here for the community to discover.
          </p>
        </div>
      )}

    </div>
  );
}
