import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { createCampaign } from "../actions";
import { createClient } from "@/utils/supabase/server";
import DynamicOptions from "./DynamicOptions";

export default async function NewCampaignPage() {
  const supabase = await createClient();
  
  // Fetch the available Voting Circles to populate the dropdown
  const { data: circles } = await supabase
    .from("voting_circles")
    .select("id, name")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <Link href="/dashboard/campaigns" className="inline-flex items-center text-sm font-medium text-black/50 hover:text-black transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Campaigns
        </Link>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">Create Campaign</h1>
        <p className="text-black/60 mt-1">Configure your new voting event and access controls.</p>
      </div>

      <div className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden">
        <form action={createCampaign} className="p-6 md:p-8 space-y-6">
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-black block">
              Campaign Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g., Q3 Ecosystem Grants Vote"
              className="w-full px-4 py-3 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold text-black block">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Explain what the community is voting on..."
              className="w-full px-4 py-3 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-none"
            ></textarea>
          </div>

          {/* Date Selection Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="start_date" className="text-sm font-bold text-black block">
                Start Time (Optional)
              </label>
              <input
                type="datetime-local"
                id="start_date"
                name="start_date"
                className="w-full px-4 py-3 rounded-md border border-black/10 bg-black/5 text-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end_date" className="text-sm font-bold text-black block">
                End Time (Optional)
              </label>
              <input
                type="datetime-local"
                id="end_date"
                name="end_date"
                className="w-full px-4 py-3 rounded-md border border-black/10 bg-black/5 text-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>
          </div>

          {/* --- DYNAMIC OPTIONS BLOCK --- */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-black block">
              Voting Options <span className="text-red-500">*</span>
            </label>
            <DynamicOptions />
          </div>
          {/* -------------------------------- */}


          
          {/* Access Control Section */}
          <div className="pt-6 border-t border-black/5 space-y-6">
            <h3 className="font-bold text-black flex items-center">
              <ShieldAlert size={18} className="mr-2 text-black/40" />
              Access Controls
            </h3>

            <label className="flex items-start space-x-3 cursor-pointer group bg-black/5 p-4 rounded-md border border-black/10">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  name="is_public"
                  id="is_public"
                  className="w-5 h-5 rounded border-black/20 text-black focus:ring-black/20 transition-all"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-black group-hover:text-black/80 transition-colors">Make Campaign Public</span>
                <span className="text-sm text-black/50">If checked, anyone with the link can view and vote. <strong className="text-black/70">Ignores circle restrictions below.</strong></span>
              </div>
            </label>

            <div className="space-y-2">
              <label htmlFor="circle_id" className="text-sm font-bold text-black block">
                Restrict to Voting Circle
              </label>
              <select 
                name="circle_id" 
                id="circle_id"
                className="w-full px-4 py-3 rounded-md border border-black/10 bg-black/5 text-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">No restriction (Open to whole organization)</option>
                {circles?.map((circle) => (
                  <option key={circle.id} value={circle.id}>
                    {circle.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-black/50 mt-1">Only members of this circle will be allowed to cast a ballot.</p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-black text-[#ebe6dd] font-medium rounded-md hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Launch Campaign
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}