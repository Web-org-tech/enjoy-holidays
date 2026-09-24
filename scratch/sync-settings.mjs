import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Simple env file reader if process.env values are missing
try {
  const envContent = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0 && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  });
} catch (e) {
  // ignore
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

async function main() {
  console.log("Checking Supabase site_settings...");

  const { data: existing, error: fetchErr } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (fetchErr) {
    console.error("Error fetching site_settings:", fetchErr);
    return;
  }

  const newContactInfo = {
    phone: "+91 98659 87975",
    whatsapp_number: "917010111256",
    email: "nirmalharish1980@gmail.com",
    address: "No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai - 625002",
    business_hours: "24 Hours (24/7)",
  };

  const newHeroContent = {
    headline: "Where Will You\nWander Next?",
    subtext: "Daily tours, Madurai local sightseeing, and customized holiday packages across India since 2004.",
    cta_primary_label: "Explore Packages",
    cta_secondary_label: "WhatsApp Us",
    background_media_url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80",
    background_media_type: "image",
  };

  if (existing?.id) {
    console.log("Updating existing site_settings row (id:", existing.id, ")...");
    const { error: updateErr } = await supabase
      .from("site_settings")
      .update({
        contact_info: newContactInfo,
        hero_content: newHeroContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateErr) {
      console.error("Error updating site_settings:", updateErr);
    } else {
      console.log("Successfully updated site_settings in Supabase!");
    }
  } else {
    console.log("Inserting new site_settings row...");
    const { error: insertErr } = await supabase
      .from("site_settings")
      .insert([
        {
          contact_info: newContactInfo,
          hero_content: newHeroContent,
        },
      ]);

    if (insertErr) {
      console.error("Error inserting site_settings:", insertErr);
    } else {
      console.log("Successfully inserted site_settings in Supabase!");
    }
  }
}

main();
