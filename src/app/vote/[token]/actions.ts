"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitVote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  
  if (!user || user.app_metadata.provider !== 'discord') {
    throw new Error("You must verify your identity with Discord to vote.");
  }

  const token = formData.get("token") as string;
  const selectedOption = formData.get("selectedOption") as string; // Fetch the selected option text

  // 1. Get the campaign from the token (which is now the campaign ID)
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id")
    .eq("id", token)
    .single();

  if (!campaign) throw new Error("Campaign not found.");

  // 2. Cast the vote with the selected option
  const { error } = await supabase.from("ballots").insert([
    {
      campaign_id: campaign.id,
      user_id: user.id,
      selected_option: selectedOption, 
      weight_used: 1 // Save the selected option text
    }
  ]);

  

  // To this:
  if (error) {
    console.error("Voting error:", error);
    throw new Error(`Failed to cast vote: ${error.message}`);
  }

  // 3. Refresh the page to show their recorded vote
  revalidatePath(`/vote/${token}`);
}

export async function unlockCampaign(formData: FormData) {
  const supabase = await createClient();
  const token = formData.get("token") as string;
  const passwordInput = formData.get("password") as string;

  // Fetch the real password from the database
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("voting_password")
    .eq("id", token)
    .single();

  // Check if it matches
  if (campaign?.voting_password && campaign.voting_password === passwordInput) {
    // If correct, set a cookie to unlock the page
    const cookieStore = await cookies();
    cookieStore.set(`unlocked_${token}`, "true");
  } else {
    throw new Error("Incorrect password. Please try again.");
  }

  // Refresh the page to show the voting options
  revalidatePath(`/vote/${token}`);
}