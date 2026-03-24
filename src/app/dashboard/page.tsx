import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Activity, Plus, Users, Vote } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Securely fetch the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Extract Discord name and avatar
  // Prioritize Discord's 'global_name' (Display Name) over the raw username
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
        <button className="flex items-center justify-center space-x-2 bg-black text-[#ebe6dd] px-5 py-2.5 rounded-md font-medium hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md active:scale-95">
          <Plus size={18} />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-black/60 font-medium">Active Campaigns</span>
            <Vote className="text-black/40" size={20} />
          </div>
          <span className="text-3xl font-heading font-bold text-black">0</span>
        </div>

        <div className="bg-white border border-black/10 p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-black/60 font-medium">Voting Circles</span>
            <Users className="text-black/40" size={20} />
          </div>
          <span className="text-3xl font-heading font-bold text-black">0</span>
        </div>

        <div className="bg-white border border-black/10 p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-black/60 font-medium">Total Votes Cast</span>
            <Activity className="text-black/40" size={20} />
          </div>
          <span className="text-3xl font-heading font-bold text-black">0</span>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-black/10 px-6 py-4">
          <h2 className="font-medium text-black">Recent Activity</h2>
        </div>
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
          <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/30 mb-2">
            <Activity size={24} />
          </div>
          <p className="text-black/60">No recent activity found.</p>
          <button className="text-sm font-medium text-black underline underline-offset-4 hover:opacity-70 transition-opacity">
            Launch your first campaign
          </button>
        </div>
      </div>

    </div>
  );
}