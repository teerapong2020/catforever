import { configDotenv } from "dotenv";
import { createClient } from "@supabase/supabase-js";

configDotenv();

const supabase  = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


export default supabase 