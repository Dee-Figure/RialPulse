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
  
  // MAGIC TRICK: This grabs every input field named "options" and creates an array
  // Example output: ["Marketing Budget", "Dev Grant", "Treasury Hold"]
  const optionsArray = formData.getAll("options") as string[];

  // 1. Grab and format the dates (if the user provided them)
  const startDateInput = formData.get("start_date") as string;
  const endDateInput = formData.get("end_date") as string;
  
  const start_date = startDateInput ? new Date(startDateInput).toISOString() : null;
  const end_date = endDateInput ? new Date(endDateInput).toISOString() : null;

  const { data: existingMember } = await supabase
    .from("organization_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  // 2. Insert into the database
  const { data: newCampaign, error: campaignError } = await supabase
    .from("campaigns")
    .insert({
      created_by: user.id,
      title,
      description,
      start_date: start_date,
      end_date: end_date,
      is_public: isPublic,
      status: "ACTIVE",
      options: optionsArray
    })
    .select()
    .single();

  // Error handling to catch and throw database errors
  if (campaignError) {
    console.error("SUPABASE INSERT ERROR:", campaignError);
    throw new Error(`Database Error: ${campaignError.message}`);
  }

  if (!newCampaign) return redirect("/dashboard/campaigns?error=Failed");



  // Insert Access Control (if private)
  if (!isPublic && circleId) {
    await supabase.from("campaign_access").insert([
      { campaign_id: newCampaign.id, target_type: "CIRCLE", target_id: circleId, voting_power: 1 }
    ]);
  }

  redirect("/dashboard/campaigns");
}