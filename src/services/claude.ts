import { Ingredient, Recipe, Substitution, CuisineGroup } from '@/types/recipe';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function analyzeImage(base64Image: string): Promise<Ingredient[]> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze image');
  }

  const data = await response.json();
  return data.ingredients;
}

export async function generateRecipes(ingredients: Ingredient[]): Promise<CuisineGroup[]> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ ingredients }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate recipes');
  }

  const data = await response.json();
  return data.cuisines;
}

export async function generateSubstitutions(
  recipe: Recipe,
  availableIngredients: Ingredient[]
): Promise<Substitution[]> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-substitutions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ recipe, ingredients: availableIngredients }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate substitutions');
  }

  const data = await response.json();
  return data.substitutions;
}

