import { useState } from 'react';
import { X, Plus, Mic } from 'lucide-react';
import { Ingredient } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import VoiceControls from '@/components/VoiceControls';

interface IngredientListProps {
  ingredients: Ingredient[];
  onRemove: (index: number) => void;
  onAdd: (ingredient: Ingredient) => void;
}

const IngredientList = ({ ingredients, onRemove, onAdd }: IngredientListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ name: '', category: 'produce' as Ingredient['category'], quantity: '' });

  const handleAdd = () => {
    if (newIngredient.name.trim()) {
      onAdd({
        name: newIngredient.name.trim().toLowerCase(),
        category: newIngredient.category,
        quantity: newIngredient.quantity.trim() || undefined
      });
      setNewIngredient({ name: '', category: 'produce', quantity: '' });
      setIsDialogOpen(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    // Extract ingredient name from voice input
    const cleaned = text.toLowerCase().trim();
    setNewIngredient(prev => ({ ...prev, name: cleaned }));
    setIsDialogOpen(true);
  };

  if (ingredients.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto animate-scale-in">
      <div className="glass-card rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-foreground font-display">
            Your Ingredients
          </h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
            <span className="text-sm font-semibold text-primary">
              {ingredients.length} items detected
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {ingredients.map((ingredient, index) => (
            <div
              key={`${ingredient.name}-${ingredient.category}`}
              className={`ingredient-chip ${ingredient.category} group hover:scale-105 transition-transform shadow-sm hover:shadow-md`}
            >
              <span className="font-medium">
                {ingredient.name}
                {ingredient.quantity && (
                  <span className="opacity-90 ml-1.5 font-normal">• {ingredient.quantity}</span>
                )}
              </span>
              <button
                onClick={() => onRemove(index)}
                className="opacity-0 group-hover:opacity-100 transition-all hover:rotate-90 duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Add Ingredient Actions */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Ingredient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Ingredient Manually</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Ingredient Name</Label>
                  <Input
                    id="name"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    placeholder="e.g., tomato, chicken breast"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newIngredient.category}
                    onValueChange={(value: Ingredient['category']) =>
                      setNewIngredient({ ...newIngredient, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produce">Produce</SelectItem>
                      <SelectItem value="protein">Protein</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="grain">Grain</SelectItem>
                      <SelectItem value="spice">Spice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity (optional)</Label>
                  <Input
                    id="quantity"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                    placeholder="e.g., 2, 1 cup, 500g"
                  />
                </div>
                <Button onClick={handleAdd} className="w-full">
                  Add to List
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">or</span>
            <VoiceControls
              onTranscript={handleVoiceTranscript}
              autoListen={false}
            />
            <span className="text-sm text-muted-foreground">say it</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Click the × to remove any incorrect items • Use voice or manual input to add more
        </p>
      </div>
    </div>
  );
};

export default IngredientList;
