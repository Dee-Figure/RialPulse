"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createCampaign(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const isPublic = formData.get("is_public") === "on";
  const circleId = formData.get("circle_id") as string;
  const rawOptions = formData.get("options") as string; // <-- Fetch the new options

  const { data: existingMember } = await supabase
    .from("organization_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  const orgId = existingMember?.org_id;
  if (!orgId) throw new Error("Organization required.");

  // Insert Campaign
  const { data: newCampaign, error: campaignError } = await supabase
    .from("campaigns")
    .insert([{ org_id: orgId, title, description, is_public: isPublic, status: "ACTIVE" }])
    .select("id")
    .single();

  if (campaignError || !newCampaign) return redirect("/dashboard/campaigns?error=Failed");

  // --- NEW: Insert Custom Options ---
  if (rawOptions) {
    // Split by new line and remove empty lines
    const optionLines = rawOptions.split('\n').map(opt => opt.trim()).filter(opt => opt.length > 0);
    
    if (optionLines.length > 0) {
      const optionsToInsert = optionLines.map(text => ({
        campaign_id: newCampaign.id,
        option_text: text
      }));

      const { error: optionsError } = await supabase.from("campaign_options").insert(optionsToInsert);
      if (optionsError) console.error("Error inserting options:", optionsError);
    }
  }

  // Insert Access Control (if private)
  if (!isPublic && circleId) {
    await supabase.from("campaign_access").insert([
      { campaign_id: newCampaign.id, target_type: "CIRCLE", target_id: circleId, voting_power: 1 }
    ]);
  }

  redirect("/dashboard/campaigns");
}