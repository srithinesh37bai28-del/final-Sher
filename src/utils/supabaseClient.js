import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oxqqweqdozlbtsxfqnsw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cXF3ZXFkb3psYnRzeGZxbnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MzQyMzYsImV4cCI6MjEwMzUxMDIzNn0.5V0b9_cNCAkVfNjLb7GCOzjkvBUF02DjbtGeG-rLOxA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
