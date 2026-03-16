import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nmpjeeeqroldjledcpdy.supabase.co'
const supabaseKey = 'sb_publishable_LmCmlQkfeVpUQbs_IfArXg_XHhmJUZ6'

export const supabase = createClient(supabaseUrl, supabaseKey)
