// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qryjqhdgditywgjcwzam.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyeWpxaGRnZGl0eXdnamN3emFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3NTM4MTAsImV4cCI6MjAyOTMyOTgxMH0.fKsLBqMulkovVPq_Lv5MvA2wMu4VKis3AQ2s0vve3OM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
