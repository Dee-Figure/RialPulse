"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function castVote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to vote.");
  }

  const token = formData.get("token") as string;
  const optionId = formData.get("option_id") as string; // Fetch the specific option they clicked

  // 1. Get the campaign ID from the share token
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id")
    .eq("share_token", token)
    .single();

  if (!campaign) throw new Error("Campaign not found.");

  // 2. Cast the vote with the new option_id
  const { error } = await supabase.from("ballots").insert([
    {
      campaign_id: campaign.id,
      user_id: user.id,
      option_id: optionId, // Save the dynamic choice
      weight_used: 1, 
    }
  ]);

  if (error) console.error("Voting error:", error);

  // 3. Refresh the page to show their recorded vote
  revalidatePath(`/vote/${token}`);
}