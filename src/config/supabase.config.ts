import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

if (!Deno.env.get("SUPABASE_URL") || !Deno.env.get("SUPABASE_KEY")) {
    throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_KEY")!
); 