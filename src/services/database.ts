import { supabase } from '@/integrations/supabase/client';
import { Recipe, Ingredient } from '@/types/recipe';

const SESSION_KEY = 'recipe_remix_session_id';

export interface SavedRecipe {
  id: string;
  session_id: string;
  recipe_title: string;
  recipe_data: Recipe;
  ingredients_used: Ingredient[];
  is_favorite: boolean;
  created_at: string;
}

// Get or create a session ID for anonymous users
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

// Save a recipe to the database
export const saveRecipe = async (recipe: Recipe, ingredients: Ingredient[]): Promise<SavedRecipe | null> => {
  const sessionId = getOrCreateSessionId();
  
  const { data, error } = await supabase
    .from('saved_recipes')
    .insert({
      session_id: sessionId,
      recipe_title: recipe.title,
      recipe_data: recipe as any,
      ingredients_used: ingredients as any,
      is_favorite: false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving recipe:', error);
    return null;
  }
  
  return {
    ...data,
    recipe_data: data.recipe_data as unknown as Recipe,
    ingredients_used: data.ingredients_used as unknown as Ingredient[]
  } as SavedRecipe;
};

// Get all saved recipes for current session
export const getSavedRecipes = async (): Promise<SavedRecipe[]> => {
  const sessionId = getOrCreateSessionId();
  
  const { data, error } = await supabase
    .from('saved_recipes')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching saved recipes:', error);
    return [];
  }
  
  return (data || []).map(item => ({
    ...item,
    recipe_data: item.recipe_data as unknown as Recipe,
    ingredients_used: item.ingredients_used as unknown as Ingredient[]
  })) as SavedRecipe[];
};

// Delete a saved recipe
export const deleteRecipe = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('saved_recipes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }
  
  return true;
};

// Toggle favorite status
export const toggleFavorite = async (id: string, isFavorite: boolean): Promise<boolean> => {
  const { error } = await supabase
    .from('saved_recipes')
    .update({ is_favorite: isFavorite })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating favorite status:', error);
    return false;
  }
  
  return true;
};

// Get count of saved recipes
export const getSavedRecipesCount = async (): Promise<number> => {
  const sessionId = getOrCreateSessionId();
  
  const { count, error } = await supabase
    .from('saved_recipes')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId);
  
  if (error) {
    console.error('Error getting recipe count:', error);
    return 0;
  }
  
  return count || 0;
};

