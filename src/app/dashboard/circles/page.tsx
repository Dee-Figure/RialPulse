import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Users, ShieldCheck, UserPlus } from "lucide-react";

export default async function CirclesPage() {
  const supabase = await createClient();

  // Fetch circles that belong to the user's organizations
  const { data: circles } = await supabase
    .from("voting_circles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">Voting Circles</h1>
          <p className="text-black/60 mt-1">Group your members into specific factions with custom voting weights.</p>
        </div>
        <Link
          href="/dashboard/circles/new"
          className="flex items-center justify-center space-x-2 bg-black text-[#ebe6dd] px-5 py-2.5 rounded-md font-medium hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus size={18} />
          <span>New Circle</span>
        </Link>
      </div>

      {/* Circles Grid */}
      {(!circles || circles.length === 0) ? (
        <div className="bg-white border border-black/10 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-black/30">
            <Users size={32} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-black">No voting circles created</h3>
            <p className="text-black/50 max-w-sm mt-1">Create groups like "Core Team" or "Beta Testers" to assign them specific voting power.</p>
          </div>
          <Link href="/dashboard/circles/new" className="mt-4 px-6 py-2 bg-black/5 hover:bg-black/10 text-black font-medium rounded-md transition-colors">
            Create Circle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((circle) => (
            <div key={circle.id} className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between min-h-[200px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/60">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-xl text-black leading-tight">
                  {circle.name}
                </h3>
                <p className="text-black/60 text-sm mt-2 line-clamp-2">
                  {circle.description || "No description provided."}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/5 flex justify-between items-center text-sm">
                <div className="flex items-center text-black/50 font-medium">
                  <Users size={16} className="mr-2" />
                  {/* Hardcoded 0 for UI purposes right now until we build the member addition logic */}
                  <span>0 Members</span>
                </div>
                <Link 
                  href={`/dashboard/circles/${circle.id}`}
                  className="text-black font-medium flex items-center hover:opacity-70 transition-opacity"
                >
                  <UserPlus size={16} className="mr-1" />
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}