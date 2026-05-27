import { Clock, ChefHat, CheckCircle2, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
}

const RecipeCard = ({ recipe, onSelect }: RecipeCardProps) => {
  const difficultyColors = {
    easy: 'text-success',
    medium: 'text-warning',
    hard: 'text-danger',
  };

  return (
    <div className="recipe-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2 text-foreground">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span className={difficultyColors[recipe.difficulty]}>
                {recipe.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ListChecks className="w-4 h-4" />
              <span>{recipe.steps?.length || 0} steps</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - recipe.matchPercentage / 100)}`}
                className="text-success transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">
                {recipe.matchPercentage}%
              </span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground mt-1">match</span>
        </div>
      </div>

      <p className="text-foreground mb-4 leading-relaxed">
        {recipe.description}
      </p>

      <div className="flex items-center gap-2 mb-4 text-sm">
        <CheckCircle2 className="w-4 h-4 text-success" />
        <span className="text-muted-foreground">
          You have {recipe.ingredientsMatched.length} of {recipe.ingredientsNeeded.length} ingredients
        </span>
      </div>

      <Button 
        onClick={onSelect}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
        size="lg"
      >
        <ChefHat className="w-5 h-5 mr-2" />
        Start Cooking
      </Button>
    </div>
  );
};

export default RecipeCard;
