// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oscabjzgpnrpngiwobri.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2FianpncG5ycG5naXdvYnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzkyMzksImV4cCI6MjA2MDIxNTIzOX0.toQ2BpcP-sSwziT0iXxyOkMyeORAPBXl4KPIufPMKGg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);