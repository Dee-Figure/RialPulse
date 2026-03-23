"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrganization(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Grab all the inputs from the form
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const website = formData.get("website") as string;
  const org_type = formData.get("org_type") as string;
  const country = formData.get("country") as string;

  // 1. Find which organization this user belongs to
  const { data: member } = await supabase
    .from("organization_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!member?.org_id) throw new Error("No organization found");

  // 2. Update the organization record
  const { error } = await supabase
    .from("organizations")
    .update({
      name,
      description,
      website,
      org_type,
      country,
    })
    .eq("id", member.org_id);

  if (error) {
    console.error("Update failed:", error);
    throw new Error("Failed to update organization");
  }

  // 3. Refresh the page so the new data instantly shows up
  revalidatePath("/dashboard/settings");
}