import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserPlus, ShieldCheck, Mail } from "lucide-react";
import { addMemberToCircle } from "./actions";

export default async function CircleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const circleId = resolvedParams.id;
  const supabase = await createClient();

  // 1. Fetch the Circle details
  const { data: circle } = await supabase
    .from("voting_circles")
    .select("*")
    .eq("id", circleId)
    .single();

  if (!circle) notFound();

  // 2. Fetch the Members of this circle
  const { data: members } = await supabase
    .from("circle_members")
    .select(`
      user_id,
      users (
        email,
        full_name
      )
    `)
    .eq("circle_id", circleId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <Link href="/dashboard/circles" className="inline-flex items-center text-sm font-medium text-black/50 hover:text-black transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Circles
        </Link>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black/60">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">{circle.name}</h1>
            <p className="text-black/60 mt-1 max-w-2xl">{circle.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* Left Column: Member List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg text-black">Members ({members?.length || 0})</h3>
          
          <div className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden">
            {(!members || members.length === 0) ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/30 mb-3">
                  <UserPlus size={20} />
                </div>
                <p className="font-medium text-black">No members yet</p>
                <p className="text-sm text-black/50 mt-1">Add your team members using the form.</p>
              </div>
            ) : (
              <ul className="divide-y divide-black/5">
                {members.map((member: any) => (
                  <li key={member.user_id} className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-black text-[#ebe6dd] flex items-center justify-center text-sm font-bold uppercase">
                        {member.users?.email?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">{member.users?.full_name || "User"}</p>
                        <p className="text-xs text-black/60">{member.users?.email}</p>
                      </div>
                    </div>
                    <button className="text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded transition-colors">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Add Member Form */}
        <div>
          <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm sticky top-6">
            <h3 className="font-bold text-black mb-4">Add New Member</h3>
            <form action={addMemberToCircle} className="space-y-4">
              <input type="hidden" name="circleId" value={circle.id} />
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-black uppercase tracking-wider">User Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-black/40" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="teammate@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm"
                  />
                </div>
                <p className="text-[11px] text-black/50 leading-tight pt-1">
                  Note: The user must have logged into Rialo Pulse at least once to be added.
                </p>
              </div>

              <button type="submit" className="w-full px-4 py-2.5 bg-black text-[#ebe6dd] font-medium rounded-md hover:bg-zinc-800 transition-colors shadow-sm active:scale-[0.98] text-sm flex justify-center items-center">
                <UserPlus size={16} className="mr-2" />
                Add to Circle
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
