import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Ingredient {
  name: string;
  category: string;
  quantity?: string;
}

interface Recipe {
  title: string;
  cookTime: number;
  difficulty: string;
  ingredientsNeeded: string[];
  ingredientsMatched: string[];
  matchPercentage: number;
  description: string;
}

interface Substitution {
  original: string;
  substitute: string;
  flavorScience: string;
  flavorImpact: number;
  textureImpact: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipe, ingredients } = await req.json();
    
    if (!recipe || !ingredients || !Array.isArray(ingredients)) {
      return new Response(
        JSON.stringify({ error: 'Recipe and ingredients array are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!recipe.title || typeof recipe.title !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Recipe must have a valid title' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(recipe.ingredientsNeeded) || !Array.isArray(recipe.ingredientsMatched)) {
      return new Response(
        JSON.stringify({ error: 'Recipe must include ingredientsNeeded and ingredientsMatched arrays' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const available = ingredients.map((i: Ingredient) => i.name).join(', ');
    const needed = recipe.ingredientsNeeded.join(', ');
    const missing = recipe.ingredientsNeeded.filter(
      (ingredient: string) => !recipe.ingredientsMatched.includes(ingredient)
    );

    if (missing.length === 0) {
      return new Response(
        JSON.stringify({ substitutions: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating substitutions for missing ingredients:', missing.join(', '));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Recipe: ${recipe.title}
Ingredients I have: ${available}
All ingredients needed: ${needed}
Missing ingredients: ${missing.join(', ')}

For each missing ingredient, suggest a creative substitution using what I have. Return a JSON array:
[
  {
    "original": "missing ingredient",
    "substitute": "ingredient from my list to use instead",
    "flavorScience": "2-3 sentences explaining the chemistry/science behind why this substitution works. Include specific compounds, flavors, or cooking properties.",
    "flavorImpact": 1-5,
    "textureImpact": 1-5
  }
]

Requirements:
- Only substitute ingredients I don't have
- Substitutes must come from my available ingredients
- flavorImpact: 1=minimal change, 5=significant change
- textureImpact: 1=minimal change, 5=significant change
- flavorScience must be educational and specific (mention acids, umami, Maillard reaction, etc.)
- Be creative but practical

Return ONLY the JSON array, no other text.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', response.status, error);
      return new Response(
        JSON.stringify({ error: `Claude API error: ${error}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const responseText = data.content[0].text;
    
    console.log('Claude response:', responseText);

    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Failed to parse JSON from response:', responseText);
      return new Response(
        JSON.stringify({ error: 'Failed to parse substitutions from response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const substitutions: Substitution[] = JSON.parse(jsonMatch[0]);
    
    return new Response(
      JSON.stringify({ substitutions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-substitutions function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
