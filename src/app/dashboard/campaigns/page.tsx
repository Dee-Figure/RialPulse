import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Vote, Calendar, Globe, Lock } from "lucide-react";

export default async function CampaignsPage() {
  const supabase = await createClient();

  // Fetch campaigns that belong to the user's organizations
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">Campaigns</h1>
          <p className="text-black/60 mt-1">Manage your active voting events and proposals.</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="flex items-center justify-center space-x-2 bg-black text-rialo-cream px-5 py-2.5 rounded-md font-medium hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus size={18} />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Campaigns Grid */}
      {(!campaigns || campaigns.length === 0) ? (
        <div className="bg-white border border-black/10 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-black/30">
            <Vote size={32} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-black">No campaigns yet</h3>
            <p className="text-black/50 max-w-sm mt-1">Get started by creating your first voting campaign to coordinate your organization.</p>
          </div>
          <Link href="/dashboard/campaigns/new" className="mt-4 px-6 py-2 bg-black/5 hover:bg-black/10 text-black font-medium rounded-md transition-colors">
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    {campaign.status}
                  </span>
                  {campaign.is_public ? (
                    <Globe size={16} className="text-black/40" />
                  ) : (
                    <Lock size={16} className="text-black/40" />
                  )}
                </div>
                <h3 className="font-heading font-bold text-xl text-black leading-tight line-clamp-2">
                  {campaign.title}
                </h3>
                <p className="text-black/60 text-sm mt-2 line-clamp-2">
                  {campaign.description || "No description provided."}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/5 flex justify-between items-center text-sm text-black/50 font-medium">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1.5" />
                  <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                </div>
                <Link href={`/dashboard/campaigns/${campaign.id}`} className="text-black hover:underline underline-offset-4 font-medium">
                  Manage →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}