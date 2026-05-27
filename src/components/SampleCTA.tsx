import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Ingredient } from '@/types/recipe';

interface SampleCTAProps {
  onLoadSample: (ingredients: Ingredient[]) => void;
}

const SampleCTA = ({ onLoadSample }: SampleCTAProps) => {
  const handleLoadSample = () => {
    const sampleIngredients: Ingredient[] = [
      { name: 'chicken breast', category: 'protein', quantity: '2' },
      { name: 'tomatoes', category: 'produce', quantity: '4' },
      { name: 'onion', category: 'produce', quantity: '1' },
      { name: 'garlic', category: 'produce', quantity: '6 cloves' },
      { name: 'olive oil', category: 'spice', quantity: '3 tbsp' },
      { name: 'rice', category: 'grain', quantity: '2 cups' },
      { name: 'bell pepper', category: 'produce', quantity: '2' },
      { name: 'spinach', category: 'produce', quantity: '1 bunch' },
    ];
    onLoadSample(sampleIngredients);
  };

  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 border-2 border-primary/20 rounded-2xl">
        <Sparkles className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">
          Want to see how it works first?
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLoadSample}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium transition-all hover:scale-105"
        >
          Try Sample Fridge
        </Button>
      </div>
    </div>
  );
};

export default SampleCTA;
