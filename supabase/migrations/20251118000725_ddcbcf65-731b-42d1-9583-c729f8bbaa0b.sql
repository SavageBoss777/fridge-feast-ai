-- Create saved_recipes table for storing user's saved recipes
CREATE TABLE public.saved_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  recipe_title text NOT NULL,
  recipe_data jsonb NOT NULL,
  ingredients_used jsonb NOT NULL,
  is_favorite boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for anonymous users (demo app)
CREATE POLICY "Allow all operations for anonymous users"
ON public.saved_recipes
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index on session_id for faster queries
CREATE INDEX idx_saved_recipes_session_id ON public.saved_recipes(session_id);

-- Create index on created_at for sorting
CREATE INDEX idx_saved_recipes_created_at ON public.saved_recipes(created_at DESC);