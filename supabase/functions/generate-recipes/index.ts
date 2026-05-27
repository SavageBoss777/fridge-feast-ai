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

interface CookingStep {
  stepNumber: number;
  instruction: string;
  estimatedTime?: string;
}

interface Recipe {
  title: string;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredientsNeeded: string[];
  ingredientsMatched: string[];
  matchPercentage: number;
  description: string;
  steps: CookingStep[];
  cuisine?: string;
}

interface CuisineGroup {
  name: string;
  description: string;
  recipes: Recipe[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients } = await req.json();
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return new Response(
        JSON.stringify({ error: 'Ingredients array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (ingredients.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Too many ingredients. Please provide at most 50.' }),
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

    const ingredientList = ingredients.map((i: Ingredient) => i.name).join(', ');
    
    console.log('Generating recipes for ingredients:', ingredientList);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3500,
        messages: [
          {
            role: 'user',
            content: `I have these ingredients: ${ingredientList}

Generate 3 DIFFERENT cuisine styles, each with 2 recipe suggestions (6 total). Return ONLY valid JSON array with this EXACT structure:
[
  {
    "name": "Mediterranean",
    "description": "Fresh, healthy dishes with olive oil and herbs",
    "recipes": [
      {
        "title": "Recipe Name",
        "cookTime": 25,
        "difficulty": "easy|medium|hard",
        "ingredientsNeeded": ["ingredient1", "ingredient2", ...],
        "ingredientsMatched": ["ingredient1", "ingredient2", ...],
        "matchPercentage": 75,
        "description": "A compelling 2-3 sentence description",
        "cuisine": "Mediterranean",
        "steps": [
          {
            "stepNumber": 1,
            "instruction": "Clear, actionable instruction",
            "estimatedTime": "5 min"
          }
        ]
      }
    ]
  }
]

CRITICAL Requirements:
- Choose 3 distinct cuisines (Mediterranean, Asian, Mexican or similar)
- Each cuisine must have EXACTLY 2 recipes
- Each recipe must have EXACTLY 4-5 cooking steps
- Keep descriptions under 100 characters
- ingredientsMatched: only ingredients from my list
- matchPercentage: round to nearest integer
- Ensure all JSON is VALID - use double quotes, escape special chars
- cuisine field must match cuisine group name exactly

Return ONLY the JSON array. NO markdown, NO explanations, ONLY the JSON array starting with [ and ending with ].`,
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
        JSON.stringify({ error: 'Failed to parse recipes from response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let cuisines: CuisineGroup[];
    try {
      cuisines = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', jsonMatch[0].substring(0, 500));
      // Try to clean and re-parse
      let cleaned = jsonMatch[0]
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .replace(/\t/g, ' ');
      
      try {
        cuisines = JSON.parse(cleaned);
      } catch (secondError) {
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in Claude response', details: String(parseError) }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ cuisines }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recipes function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
