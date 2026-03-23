import { createClient } from "@/utils/supabase/server";
import { Camera, Globe, MapPin, Building, FileText } from "lucide-react";
import { updateOrganization } from "./actions";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let org = null;
  if (user) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("org_id")
      .eq("user_id", user.id)
      .single();

    if (member?.org_id) {
      const { data: orgData } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", member.org_id)
        .single();
      org = orgData;
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">Settings</h1>
        <p className="text-black/60 mt-1">Manage your organization and public profile preferences.</p>
      </div>

      <form action={updateOrganization} className="space-y-6">

        {/* Public Profile Section */}
        <div className="bg-white border border-black/10 rounded-xl p-6 md:p-8 shadow-sm space-y-8">

          <div>
            <h3 className="font-bold text-xl text-black">Public Profile</h3>
            <p className="text-sm text-black/60 mt-1">This information will be displayed publicly on your voting pages to verify your identity to voters.</p>
          </div>

          {/* Avatar Upload (UI Only for now) */}
          <div className="flex items-center space-x-6 pt-2">
            <div className="h-24 w-24 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-black/40 overflow-hidden relative group cursor-pointer hover:bg-black/10 transition-colors">
              <Camera size={28} className="group-hover:scale-110 transition-transform" />
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">Organization Avatar</h4>
              <p className="text-xs text-black/50 mt-1 mb-3">Recommended size: 256x256px. Max 2MB.</p>
              <button type="button" className="px-4 py-2 bg-black/5 hover:bg-black/10 text-black text-sm font-medium rounded-md transition-colors border border-black/10">
                Upload Image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/5">

            {/* Organization Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-black block">Organization Name</label>
              <input
                type="text"
                name="name"
                defaultValue={org?.name || ""}
                required
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-black/5 text-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-black flex items-center">
                <FileText size={16} className="mr-2 text-black/40" />
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={org?.description || ""}
                placeholder="Briefly describe your organization's mission..."
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-none"
              ></textarea>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-black flex items-center">
                <Globe size={16} className="mr-2 text-black/40" />
                Website
              </label>
              <input
                type="url"
                name="website"
                defaultValue={org?.website || ""}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>

            {/* Organization Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-black flex items-center">
                <Building size={16} className="mr-2 text-black/40" />
                Organization Type
              </label>
              <select
                name="org_type"
                defaultValue={org?.org_type || ""}
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-black/5 text-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a type...</option>
                <option value="dao">DAO / Web3 Protocol</option>
                <option value="enterprise">Enterprise / Corporate</option>
                <option value="nonprofit">Non-Profit / NGO</option>
                <option value="community">Community / Open Source</option>
              </select>
            </div>

            {/* Country */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-black flex items-center">
                <MapPin size={16} className="mr-2 text-black/40" />
                Country / Jurisdiction
              </label>
              <select
                name="country"
                defaultValue={org?.country || ""}
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-black/5 text-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a country...</option>
                <option value="ng">Nigeria</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="sg">Singapore</option>
                <option value="ch">Switzerland</option>
                <option value="other">Other</option>
              </select>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-8 py-3 bg-black text-[#ebe6dd] font-medium rounded-md hover:bg-zinc-800 transition-colors shadow-sm active:scale-[0.98]">
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}
