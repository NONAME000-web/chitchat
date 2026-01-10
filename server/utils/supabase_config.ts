import { createClient } from "@supabase/supabase-js";

export const clientCDN = 
createClient(useRuntimeConfig().public.supabase_URL, useRuntimeConfig().public.supabase_Key)