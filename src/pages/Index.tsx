import { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';
import IngredientList from '@/components/IngredientList';
import RecipeCard from '@/components/RecipeCard';
import CookingInstructions from '@/components/CookingInstructions';
import SubstitutionPanel from '@/components/SubstitutionPanel';
import SavedRecipesPanel from '@/components/SavedRecipesPanel';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import FeatureHighlights from '@/components/FeatureHighlights';
import ExampleRecipes from '@/components/ExampleRecipes';
import SubstitutionShowcase from '@/components/SubstitutionShowcase';
import SampleCTA from '@/components/SampleCTA';
import { Ingredient, Recipe, Substitution, CuisineGroup } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateRecipes, generateSubstitutions } from '@/services/claude';
import { getSavedRecipesCount } from '@/services/database';
import logo from '@/assets/logo.png';

type AppState = 'upload' | 'ingredients' | 'recipes' | 'cooking-instructions' | 'substitutions' | 'saved-recipes';

const Index = () => {
  const [state, setState] = useState<AppState>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isLoadingSubstitutions, setIsLoadingSubstitutions] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [cuisines, setCuisines] = useState<CuisineGroup[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [savedRecipesCount, setSavedRecipesCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedRecipesCount();
  }, []);

  const loadSavedRecipesCount = async () => {
    const count = await getSavedRecipesCount();
    setSavedRecipesCount(count);
  };

  const handleImageAnalyzed = (detectedIngredients: Ingredient[]) => {
    setIngredients(detectedIngredients);
    setState('ingredients');
    setIsAnalyzing(false);
  };

  const handleLoadSample = (sampleIngredients: Ingredient[]) => {
    setIngredients(sampleIngredients);
    setState('ingredients');
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddIngredient = (ingredient: Ingredient) => {
    setIngredients(prev => [...prev, ingredient]);
  };

  const handleFindRecipes = async () => {
    setIsLoadingRecipes(true);
    setState('recipes');
    
    try {
      const generatedCuisines = await generateRecipes(ingredients);
      const cuisinesWithIds = generatedCuisines.map(cuisine => ({
        ...cuisine,
        recipes: cuisine.recipes.map(recipe => ({
          ...recipe,
          id: crypto.randomUUID(),
        })),
      }));
      setCuisines(cuisinesWithIds);
      const totalRecipes = generatedCuisines.reduce((sum, c) => sum + c.recipes.length, 0);
      toast({
        title: "Recipes ready!",
        description: `Found ${totalRecipes} delicious recipes across ${generatedCuisines.length} cuisines`,
      });
    } catch (error) {
      console.error('Error generating recipes:', error);
      toast({
        title: "Failed to generate recipes",
        description: "Please try again.",
        variant: "destructive",
      });
      setState('ingredients');
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setState('cooking-instructions');
  };

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setSelectedRecipe(updatedRecipe);
    // Also update in cuisines list if needed
    setCuisines(prevCuisines => 
      prevCuisines.map(cuisine => ({
        ...cuisine,
        recipes: cuisine.recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r)
      }))
    );
  };

  const handleStartSubstitutions = async () => {
    if (!selectedRecipe) return;

    setIsLoadingSubstitutions(true);
    setState('substitutions');

    try {
      const generatedSubstitutions = await generateSubstitutions(selectedRecipe, ingredients);
      setSubstitutions(generatedSubstitutions);
      if (generatedSubstitutions.length > 0) {
        toast({
          title: "Substitutions found!",
          description: `${generatedSubstitutions.length} smart substitutions ready`,
        });
      } else {
        toast({
          title: "Perfect match!",
          description: "You have all the ingredients needed",
        });
      }
    } catch (error) {
      console.error('Error generating substitutions:', error);
      toast({
        title: "Failed to generate substitutions",
        description: "Please try again.",
        variant: "destructive",
      });
      setState('cooking-instructions');
    } finally {
      setIsLoadingSubstitutions(false);
    }
  };

  const handleReset = () => {
    setState('upload');
    setIngredients([]);
    setCuisines([]);
    setSelectedRecipe(null);
    setSubstitutions([]);
  };

  const handleViewSavedRecipe = (recipe: Recipe, recipeIngredients: Ingredient[]) => {
    setSelectedRecipe(recipe);
    setIngredients(recipeIngredients);
    setState('cooking-instructions');
  };

  return (
    <div className="min-h-screen bg-background decorative-bg">
      {/* Header */}
      <header className="glass-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-3 group cursor-pointer" onClick={handleReset}>
              <img 
                src={logo} 
                alt="Recipe Remix" 
                className="h-14 w-auto transition-transform group-hover:scale-110" 
              />
              <h1 className="text-2xl font-display font-semibold text-foreground">
                Recipe Remix
              </h1>
            </div>
            
            {state !== 'saved-recipes' && (
              <Button
                variant="ghost"
                onClick={() => setState('saved-recipes')}
                className="relative"
              >
                <BookmarkCheck className="w-5 h-5 mr-2" />
                Saved Recipes
                {savedRecipesCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {savedRecipesCount}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {state === 'upload' && <HeroSection />}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 pb-24">
        {state === 'upload' && (
          <>
            {/* How It Works */}
            <HowItWorks />

            {/* Feature Highlights */}
            <FeatureHighlights />

            {/* Example Recipes */}
            <ExampleRecipes />

            {/* Substitution Showcase */}
            <SubstitutionShowcase />

            {/* Upload Section with Sample CTA */}
            <section className="py-20">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-display font-semibold text-foreground mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Upload a photo and discover your perfect recipes
                </p>
              </div>
              
              <SampleCTA onLoadSample={handleLoadSample} />
              
              <ImageUpload
                onImageAnalyzed={handleImageAnalyzed}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
            </section>
          </>
        )}

        {state !== 'upload' && (
          <div className="flex justify-end mb-6">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Start Over
            </Button>
          </div>
        )}

        <div className="space-y-12">
          {state === 'ingredients' && (
            <>
              <IngredientList
                ingredients={ingredients}
                onRemove={handleRemoveIngredient}
                onAdd={handleAddIngredient}
              />
              <div className="flex justify-center animate-slide-up">
                <Button
                  onClick={handleFindRecipes}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-12 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
                >
                  Find My Perfect Recipes
                </Button>
              </div>
            </>
          )}

          {state === 'recipes' && (
            <>
              {isLoadingRecipes ? (
                <div className="text-center py-20">
                  <div className="relative inline-block">
                    <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-6" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-2">
                    Finding perfect recipes for you...
                  </p>
                  <p className="text-base text-muted-foreground mb-6">
                    Analyzing your ingredients with AI
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setState('ingredients')}
                    className="animate-pulse"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="space-y-10 animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-5xl font-display font-bold gradient-text mb-4">
                      Your Perfect Matches
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Explore {cuisines.length} cuisines with {cuisines.reduce((sum, c) => sum + c.recipes.length, 0)} delicious recipes
                    </p>
                  </div>
                  
                  <Tabs defaultValue={cuisines[0]?.name} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      {cuisines.map((cuisine) => (
                        <TabsTrigger 
                          key={cuisine.name} 
                          value={cuisine.name}
                          className="text-base font-semibold"
                        >
                          {cuisine.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {cuisines.map((cuisine) => (
                      <TabsContent key={cuisine.name} value={cuisine.name} className="space-y-6">
                        <div className="text-center">
                          <p className="text-lg text-muted-foreground italic">
                            {cuisine.description}
                          </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                          {cuisine.recipes.map((recipe) => (
                            <RecipeCard
                              key={recipe.id ?? recipe.title}
                              recipe={recipe}
                              onSelect={() => handleSelectRecipe(recipe)}
                            />
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}
            </>
          )}

          {state === 'cooking-instructions' && selectedRecipe && (
            <CookingInstructions
              recipe={selectedRecipe}
              ingredients={ingredients}
              onBack={() => setState('recipes')}
              onSeeSubstitutions={handleStartSubstitutions}
              onRecipeUpdate={handleRecipeUpdate}
              onRecipeSaved={loadSavedRecipesCount}
            />
          )}

          {state === 'saved-recipes' && (
            <SavedRecipesPanel
              onBack={() => setState('upload')}
              onViewRecipe={handleViewSavedRecipe}
              onCountChange={loadSavedRecipesCount}
            />
          )}

          {state === 'substitutions' && (
            <>
              {isLoadingSubstitutions ? (
                <div className="text-center py-20">
                  <div className="relative inline-block">
                    <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-6" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-secondary/20 rounded-full animate-ping" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-2">
                    Analyzing substitutions with flavor science...
                  </p>
                  <p className="text-base text-muted-foreground mb-6">
                    Finding creative alternatives backed by chemistry
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setState('cooking-instructions')}
                    className="animate-pulse"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <SubstitutionPanel
                  recipeName={selectedRecipe?.title || ''}
                  substitutions={substitutions}
                  onBack={() => setState('cooking-instructions')}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-24 py-12 bg-gradient-to-t from-muted/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-3">
              <img src={logo} alt="Recipe Remix" className="h-10 w-auto opacity-80" />
              <span className="font-display font-semibold text-lg text-foreground">
                Recipe Remix
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by AI • Built with flavor science • Made with love for home cooks
            </p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <div className="w-2 h-2 rounded-full bg-accent" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
