"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function claimQuest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized: Please log in." };

  const questId = formData.get("questId") as string;
  const points = parseInt(formData.get("points") as string, 10);

  // 1. Fetch current user data from the 'users' table
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("reputation_points, claimed_quests, wallet_address")
    .eq("id", user.id)
    .single();

  if (fetchError || !userData) {
    return { error: "User profile not found in database." };
  }

  const currentPoints = userData.reputation_points || 0;
  const claimedQuests = userData.claimed_quests || [];

  // 2. Anti-Cheat: Check if they already claimed it
  if (claimedQuests.includes(questId)) {
    return { error: "You have already claimed this reward." };
  }

  // 3. The Gatekeeper: Verify actual completion
  switch (questId) {
    case "profile_setup":
      const hasAvatar = user.user_metadata?.avatar_url;
      const hasName = user.user_metadata?.global_name || user.user_metadata?.full_name;
      if (!hasAvatar && !hasName) {
        return { error: "Verification failed: Update your profile details first." };
      }
      break;

    case "first_campaign":
      const { count: campCount } = await supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("created_by", user.id);
      if (!campCount || campCount === 0) {
        return { error: "Verification failed: Deploy a campaign first." };
      }
      break;

    case "cast_vote":
      const { count: voteCount } = await supabase
        .from("ballots")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (!voteCount || voteCount === 0) {
        return { error: "Verification failed: Cast a vote first." };
      }
      break;

    case "connect_wallet":
      if (!userData.wallet_address) {
        return { error: "Verification failed: No Web3 wallet connected." };
      }
      break;

    default:
      return { error: "Unknown quest." };
  }

  // 4. Update the 'users' table
  const { error: updateError } = await supabase
    .from("users")
    .update({
      reputation_points: currentPoints + points,
      claimed_quests: [...claimedQuests, questId],
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error updating reputation:", updateError);
    return { error: "Failed to claim reward. Please try again." };
  }

  // 5. Success
  revalidatePath("/dashboard/quests");
  return { success: true };
}