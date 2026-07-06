import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fsccnupxtulkezhucqdx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7uXHEx-VvThBcNUC64rSOA_CCttaLSv';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
