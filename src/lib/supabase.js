import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xgchswinnwrkeckpgwyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY2hzd2lubndya2Vja3Bnd3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDE5ODAsImV4cCI6MjA5MjcxNzk4MH0.QwYAVFmZsMI4qGkHY4ttgJGzKh5EtAgx-VHUy023qtE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
