import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Globe, FileText, Wallet, User as UserIcon } from "lucide-react";
import { updateProfile } from "./actions";
import WalletConnect from "@/components/WalletConnect";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch user profile from the database
  const { data: userProfile } = await supabase
    .from("users")
    .select("bio, website, wallet_address")
    .eq("id", user.id)
    .single();

  // 2. Extract Discord details for the read-only UI
  const discordName = 
    user.user_metadata?.global_name || 
    user.user_metadata?.custom_claims?.global_name || 
    user.user_metadata?.full_name || 
    "Web3 Citizen";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">Settings</h1>
        <p className="text-black/60 mt-1">Manage your public profile and Web3 identity.</p>
      </div>

      <form action={updateProfile} className="space-y-6">

        {/* Read-Only Discord Identity Section */}
        <div className="bg-white border border-black/10 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-xl text-black flex items-center">
              <UserIcon size={20} className="mr-2 text-black/40" />
              Connected Identity
            </h3>
            <p className="text-sm text-black/60 mt-1">Your primary identity is verified and synced securely via Discord.</p>
          </div>

          <div className="flex items-center space-x-5 pt-4 border-t border-black/5">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Discord Avatar" className="w-16 h-16 rounded-full border border-black/10 shadow-sm" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-xl font-bold text-black/50">
                {discordName.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="text-lg font-bold text-black">{discordName}</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5865F2]/10 text-[#5865F2] mt-1 border border-[#5865F2]/20">
                Discord Verified
              </span>
            </div>
          </div>
        </div>

        {/* Editable Profile Section */}
        <div className="bg-white border border-black/10 rounded-xl p-6 md:p-8 shadow-sm space-y-8">
          <div>
            <h3 className="font-bold text-xl text-black">Public Profile</h3>
            <p className="text-sm text-black/60 mt-1">Customize how you appear to others on your voting campaigns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/5">
            
            {/* Bio / Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-black flex items-center">
                <FileText size={16} className="mr-2 text-black/40" />
                Bio
              </label>
              <textarea
                name="bio"
                rows={3}
                defaultValue={userProfile?.bio || ""}
                placeholder="Briefly describe yourself or your mission..."
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-none"
              ></textarea>
            </div>

            {/* Website */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-black flex items-center">
                <Globe size={16} className="mr-2 text-black/40" />
                Website / Social Link
              </label>
              <input
                type="url"
                name="website"
                defaultValue={userProfile?.website || ""}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2.5 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-8 py-3 bg-black text-[#ebe6dd] font-medium rounded-md hover:bg-zinc-800 transition-colors shadow-sm active:scale-[0.98]">
            Save Profile
          </button>
        </div>
      </form>

      {/* --- WEB3 IDENTITY SECTION --- */}
      <div className="bg-white border border-black/10 rounded-xl p-6 md:p-8 shadow-sm space-y-6 mt-8">
        <div>
          <h3 className="font-bold text-xl text-black flex items-center">
            <Wallet size={20} className="mr-2 text-black/40" />
            Web3 Identity
          </h3>
          <p className="text-sm text-black/60 mt-1">Connect your Rialo-compatible wallet to claim your Web3 ecosystem reputation.</p>
        </div>
        
        <div className="pt-4 border-t border-black/5">
          {/* Your existing WalletConnect component! */}
          <WalletConnect existingAddress={userProfile?.wallet_address} />
        </div>
      </div>
      {/* --------------------------------- */}

    </div>
  );
}