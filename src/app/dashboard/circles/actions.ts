"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createCircle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  // Find the user's organization
  const { data: existingMember } = await supabase
    .from("organization_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  let orgId = existingMember?.org_id;

  // Fallback: Auto-create if they somehow got here without one
  if (!orgId) {
    const { data: newOrg } = await supabase
      .from("organizations")
      .insert([{ name: "My Organization" }])
      .select("id")
      .single();

    if (newOrg) {
      orgId = newOrg.id;
      await supabase.from("organization_members").insert([
        { org_id: orgId, user_id: user.id, role: "ADMIN" }
      ]);
    }
  }

  // Insert the new Voting Circle
  if (orgId) {
    const { error } = await supabase.from("voting_circles").insert([
      {
        org_id: orgId,
        name,
        description,
      }
    ]);

    if (error) {
      console.error("Error creating circle:", error);
      return redirect("/dashboard/circles?error=Failed to create circle");
    }
  }

  redirect("/dashboard/circles");
}