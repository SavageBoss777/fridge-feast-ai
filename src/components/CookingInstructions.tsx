import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChefHat, Clock, ArrowLeft, Lightbulb, Save, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CookingStep, Recipe, Ingredient } from '@/types/recipe';
import { saveRecipe } from '@/services/database';
import { useToast } from '@/hooks/use-toast';
import RecipeChat from '@/components/RecipeChat';

interface CookingInstructionsProps {
  recipe: Recipe;
  ingredients: Ingredient[];
  onBack: () => void;
  onSeeSubstitutions: () => void;
  onRecipeUpdate?: (updatedRecipe: Recipe) => void;
  onRecipeSaved?: () => void;
}

const CookingInstructions = ({
  recipe,
  ingredients,
  onBack,
  onSeeSubstitutions,
  onRecipeUpdate,
  onRecipeSaved,
}: CookingInstructionsProps) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(recipe);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentRecipe(recipe);
  }, [recipe]);
  
  const { title: recipeName, steps, cookTime: totalTime } = currentRecipe;

  // Safety check for missing steps
  if (!steps || steps.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to recipes
        </Button>
        <div className="glass-card rounded-3xl p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4">
            No cooking steps available for this recipe. The recipe was generated before steps were added.
          </p>
          <Button onClick={onSeeSubstitutions} className="bg-accent hover:bg-accent/90">
            <Lightbulb className="w-5 h-5 mr-2" />
            See Substitutions Instead
          </Button>
        </div>
      </div>
    );
  }

  const toggleStep = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const markAllComplete = () => {
    setCompletedSteps(new Set(steps.map(s => s.stepNumber)));
  };

  const resetAll = () => {
    setCompletedSteps(new Set());
  };
  
  const handleSaveRecipe = async () => {
    setIsSaving(true);
    const savedRecipe = await saveRecipe(currentRecipe, ingredients);
    setIsSaving(false);
    
    if (savedRecipe) {
      onRecipeSaved?.();
      toast({
        title: "Recipe saved!",
        description: "You can access this recipe anytime from your saved list",
      });
    } else {
      toast({
        title: "Failed to save recipe",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleRecipeUpdate = (updates: Partial<Recipe>, explanation: string) => {
    const updatedRecipe = { ...currentRecipe, ...updates };
    setCurrentRecipe(updatedRecipe);
    if (onRecipeUpdate) {
      onRecipeUpdate(updatedRecipe);
    }
    
    toast({
      title: "Recipe updated!",
      description: explanation,
    });
  };

  const progress = (completedSteps.size / steps.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-muted"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to recipes
      </Button>

      <div className="glass-card rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-display font-bold text-foreground">
                {recipeName}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="w-4 h-4" />
                <span>{totalTime} minutes total</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                Progress: {completedSteps.size} of {steps.length} steps complete
              </span>
              <div className="flex gap-2">
                {completedSteps.size > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAll}
                    className="text-xs"
                  >
                    Reset
                  </Button>
                )}
                {completedSteps.size < steps.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllComplete}
                    className="text-xs"
                  >
                    Mark all complete
                  </Button>
                )}
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cooking Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step) => {
            const isCompleted = completedSteps.has(step.stepNumber);
            return (
              <div
                key={step.stepNumber}
                onClick={() => toggleStep(step.stepNumber)}
                className={`
                  group relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-success/5 border-success/30 opacity-75' 
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-lg'
                  }
                `}
              >
                <div className="flex gap-4">
                  {/* Step Number / Checkbox */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    ) : (
                      <div className="relative">
                        <Circle className="w-8 h-8 text-primary group-hover:text-primary/70 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary group-hover:text-primary/70">
                            {step.stepNumber}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Step {step.stepNumber}
                      </h3>
                      {step.estimatedTime && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>{step.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                    <p className={`
                      text-base leading-relaxed transition-all
                      ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}
                    `}>
                      {step.instruction}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedSteps.size === steps.length && (
          <div className="mb-8 p-6 bg-gradient-to-r from-success/10 to-primary/10 border-2 border-success/30 rounded-xl animate-scale-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Recipe Complete!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Great job! Your dish is ready to enjoy.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSaveRecipe}
            disabled={isSaving}
            variant="outline"
            className="flex-1 font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {isSaving ? (
              <>
                <Save className="w-5 h-5 mr-2 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Recipe
              </>
            )}
          </Button>
          <Button
            onClick={() => setIsChatOpen(true)}
            variant="default"
            className="flex-1 bg-primary hover:bg-primary/90 font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat with AI
          </Button>
          <Button
            onClick={onSeeSubstitutions}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            See Smart Substitutions
          </Button>
        </div>

        {/* Tip */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            💡 <span className="font-semibold">Tip:</span> Click on any step to mark it as complete as you cook
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      {isChatOpen && (
        <RecipeChat
          recipe={currentRecipe}
          ingredients={ingredients}
          onClose={() => setIsChatOpen(false)}
          onRecipeUpdate={handleRecipeUpdate}
        />
      )}
    </div>
  );
};

export default CookingInstructions;

