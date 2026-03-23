"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMemberToCircle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const circleId = formData.get("circleId") as string;
  const email = formData.get("email") as string;

  // 1. Look up the user by email in the public.users table
  const { data: targetUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (!targetUser) {
    // For this MVP, users must have signed into the app at least once 
    // to exist in the database before they can be added to a circle.
    throw new Error("User not found. They must sign up first.");
  }

  // 2. Add them to the circle
  const { error } = await supabase.from("circle_members").insert([
    {
      circle_id: circleId,
      user_id: targetUser.id,
    }
  ]);

  if (error) {
    // Usually triggers if the user is already in the circle (Unique constraint)
    console.error("Failed to add member:", error);
  }

  // 3. Refresh the page to show the new member
  revalidatePath(`/dashboard/circles/${circleId}`);
}
