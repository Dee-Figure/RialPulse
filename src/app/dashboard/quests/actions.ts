"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function claimQuest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const questId = formData.get("questId") as string;
  const points = parseInt(formData.get("points") as string, 10);

  // 1. Fetch the user's current data
  const { data: userData } = await supabase
    .from("users")
    .select("reputation_points, claimed_quests")
    .eq("id", user.id)
    .single();

  if (!userData) throw new Error("User not found");

  // 2. Security check: Have they already claimed this?
  const claimed = userData.claimed_quests || [];
  if (claimed.includes(questId)) {
    throw new Error("Quest already claimed");
  }

  // 3. Update the database: Add points and push the quest ID to the array
  const { error } = await supabase
    .from("users")
    .update({
      reputation_points: (userData.reputation_points || 0) + points,
      claimed_quests: [...claimed, questId],
    })
    .eq("id", user.id);

  if (error) console.error("Error claiming quest:", error);

  // 4. Refresh the UI
  revalidatePath("/dashboard/quests");
}
