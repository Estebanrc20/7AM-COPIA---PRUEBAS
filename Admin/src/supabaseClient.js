import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aborinpqezfrhguyzdxx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFib3JpbnBxZXpmcmhndXl6ZHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTA5NTEsImV4cCI6MjA2NTMyNjk1MX0.DzQkceEqySnUA-TLuC40l2tZBLuH1qnw8eQkRDwl3lA'
export const supabase = createClient(supabaseUrl, supabaseKey)
