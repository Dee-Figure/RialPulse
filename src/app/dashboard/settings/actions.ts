"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Grab the simplified inputs
  const bio = formData.get("bio") as string;
  const website = formData.get("website") as string;

  // Update the user's profile directly
  const { error } = await supabase
    .from("users")
    .update({
      bio: bio || null,
      website: website || null,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Update failed:", error);
    throw new Error("Failed to update profile");
  }

  // Refresh the page
  revalidatePath("/dashboard/settings");
}

export async function connectWalletAddress(walletAddress: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Save the wallet address to the user's profile
  const { error } = await supabase
    .from("users")
    .update({ wallet_address: walletAddress })
    .eq("id", user.id);

  if (error) {
    console.error("Wallet link error:", error);
    throw new Error("Failed to link wallet");
  }

  // Refresh both pages so the UI updates instantly
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/quests");
}