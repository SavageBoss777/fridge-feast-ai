import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trash2, Eye, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SavedRecipe, getSavedRecipes, deleteRecipe, toggleFavorite } from '@/services/database';
import { useToast } from '@/hooks/use-toast';
import { Recipe, Ingredient } from '@/types/recipe';

interface SavedRecipesPanelProps {
  onBack: () => void;
  onViewRecipe: (recipe: Recipe, ingredients: Ingredient[]) => void;
  onCountChange?: () => void;
}

const SavedRecipesPanel = ({ onBack, onViewRecipe, onCountChange }: SavedRecipesPanelProps) => {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    setIsLoading(true);
    const recipes = await getSavedRecipes();
    setSavedRecipes(recipes);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteRecipe(id);
    if (success) {
      setSavedRecipes(prev => prev.filter(r => r.id !== id));
      onCountChange?.();
      toast({
        title: "Recipe deleted",
        description: "Recipe removed from your saved list",
      });
    } else {
      toast({
        title: "Failed to delete",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const success = await toggleFavorite(id, newStatus);
    
    if (success) {
      setSavedRecipes(prev => prev.map(r =>
        r.id === id ? { ...r, is_favorite: newStatus } : r
      ));
    } else {
      toast({
        title: "Failed to update favorite",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleViewRecipe = (savedRecipe: SavedRecipe) => {
    onViewRecipe(savedRecipe.recipe_data, savedRecipe.ingredients_used);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Button>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading saved recipes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-muted">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to home
      </Button>

      <div className="glass-card rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">
              Saved Recipes
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} saved
            </p>
          </div>
        </div>

        {savedRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <ChefHat className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No saved recipes yet</h3>
            <p className="text-muted-foreground mb-6">
              Save your favorite recipes to access them anytime
            </p>
            <Button onClick={onBack}>
              Discover Recipes
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((savedRecipe) => (
              <Card key={savedRecipe.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {savedRecipe.recipe_title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Saved {formatDate(savedRecipe.created_at)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(savedRecipe.id, savedRecipe.is_favorite)}
                    className="ml-2"
                  >
                    <Star 
                      className={`w-5 h-5 ${
                        savedRecipe.is_favorite 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                </div>

                <div className="mb-4">
                  <Badge variant="secondary" className="mr-2">
                    {savedRecipe.recipe_data.cookTime} min
                  </Badge>
                  <Badge variant="outline">
                    {savedRecipe.recipe_data.difficulty}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleViewRecipe(savedRecipe)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(savedRecipe.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipesPanel;
