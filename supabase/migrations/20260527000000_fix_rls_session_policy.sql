-- Fix overly permissive RLS policy on saved_recipes.
-- The original policy (USING (true)) allowed any authenticated client to read
-- or modify any row, bypassing the session_id filter that only existed in app code.
--
-- This migration replaces it with a policy that restricts access to rows whose
-- session_id matches the value passed by the client as a Postgres setting.
-- The Supabase client must call:
--   supabase.rpc('set_app_session', { session_id: '<uuid>' })
-- before querying this table, or use a signed JWT claim (see NOTE below).
--
-- NOTE: For a production app, the recommended approach is to use Supabase
-- anonymous auth (supabase.auth.signInAnonymously()) and replace session_id
-- with auth.uid() in these policies.

-- Drop the original open policy
DROP POLICY IF EXISTS "Allow all operations for anonymous users" ON public.saved_recipes;

-- Create a helper function to expose the session setting safely
CREATE OR REPLACE FUNCTION public.current_session_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('app.session_id', true), '')
$$;

-- New policy: only allow access to rows whose session_id matches the caller's session
CREATE POLICY "Restrict access to own session recipes"
ON public.saved_recipes
FOR ALL
USING (session_id = public.current_session_id())
WITH CHECK (session_id = public.current_session_id());
