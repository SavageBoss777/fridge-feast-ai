import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let messages, currentRecipe, availableIngredients;
  
  try {
    const requestData = await req.json();
    messages = requestData.messages;
    currentRecipe = requestData.currentRecipe;
    availableIngredients = requestData.availableIngredients;
    
    // Validate inputs
    if (!currentRecipe || typeof currentRecipe !== 'object') {
      throw new Error('Invalid or missing currentRecipe');
    }
    if (!Array.isArray(messages)) {
      throw new Error('Invalid or missing messages array');
    }

    // Cap conversation history to the last 20 messages to prevent unbounded prompt growth
    const cappedMessages = messages.slice(-20);
    
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    // Build safe ingredient lists
    const ingredientsNeededList = Array.isArray(currentRecipe.ingredientsNeeded) 
      ? currentRecipe.ingredientsNeeded.join(', ') 
      : 'None specified';
    
    const availableIngredientsList = Array.isArray(availableIngredients) 
      ? availableIngredients.map((i: any) => i.name).join(', ') 
      : 'None specified';

    // Build context-aware system prompt
    const systemPrompt = `You are an expert cooking assistant helping users modify recipes in real-time. 

Current Recipe: "${currentRecipe.title || 'Untitled Recipe'}"
Cook Time: ${currentRecipe.cookTime || 'Not specified'} minutes
Difficulty: ${currentRecipe.difficulty || 'Not specified'}
Ingredients Needed: ${ingredientsNeededList}
Available Ingredients: ${availableIngredientsList}

Your role:
- Help users when they're missing ingredients by suggesting substitutions
- Adapt recipes for dietary restrictions, portion sizes, time constraints, or skill levels
- Provide clear, concise cooking advice
- When suggesting recipe changes, use the update_recipe tool to make modifications

Keep responses conversational and helpful. Focus on practical cooking solutions.`;

    console.log('Calling Claude API for recipe chat...');

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
        system: systemPrompt,
        messages: cappedMessages,
        tools: [{
          name: 'update_recipe',
          description: 'Update the recipe with modifications based on user requests. Use this when the user asks to change ingredients, adjust cooking time, modify steps, or make any recipe modifications.',
          input_schema: {
            type: 'object',
            properties: {
              ingredientsNeeded: {
                type: 'array',
                items: { type: 'string' },
                description: 'Updated list of all ingredients needed for the recipe'
              },
              steps: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    stepNumber: { 
                      type: 'number',
                      description: 'The step number (1, 2, 3, etc.)'
                    },
                    instruction: { 
                      type: 'string',
                      description: 'Clear instruction for this step'
                    },
                    estimatedTime: { 
                      type: 'string',
                      description: 'Estimated time for this step (e.g., "5 min", "10-15 min")'
                    }
                  },
                  required: ['stepNumber', 'instruction']
                },
                description: 'Updated cooking steps with step numbers and instructions'
              },
              cookTime: {
                type: 'number',
                description: 'Updated total cook time in minutes'
              },
              description: {
                type: 'string',
                description: 'Updated recipe description'
              },
              explanation: {
                type: 'string',
                description: 'Explanation of why these changes work and what was modified'
              }
            },
            required: ['explanation']
          }
        }],
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
    console.log('Claude response received');

    // Extract message content and tool use
    let messageContent = '';
    let recipeUpdate = null;

    for (const block of data.content) {
      if (block.type === 'text') {
        messageContent += block.text;
      } else if (block.type === 'tool_use' && block.name === 'update_recipe') {
        recipeUpdate = block.input;
      }
    }

    // Return response in format expected by client
    return new Response(
      JSON.stringify({
        message: messageContent,
        recipeUpdate: recipeUpdate,
        usage: data.usage
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Recipe chat error:', error);
    console.error('Request context:', JSON.stringify({ 
      hasRecipe: !!currentRecipe, 
      hasIngredients: !!availableIngredients,
      messageCount: messages?.length 
    }));
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
