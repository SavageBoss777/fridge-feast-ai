import { Clock, ChefHat, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockRecipes = [
  {
    title: 'Mediterranean Pasta',
    match: 92,
    time: '20 min',
    difficulty: 'Easy',
    cuisine: 'Italian',
    description: 'Fresh tomatoes, garlic, and herbs come together in this vibrant pasta dish that celebrates simple, quality ingredients.',
    icon: '🍝',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    title: 'Thai Curry Bowl',
    match: 85,
    time: '35 min',
    difficulty: 'Medium',
    cuisine: 'Asian',
    description: 'Aromatic spices and creamy coconut create a comforting bowl of bold flavors and satisfying textures.',
    icon: '🍜',
    gradient: 'from-secondary/20 to-secondary/5',
  },
];

const ExampleRecipes = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-display font-semibold text-foreground mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here's what you'll discover when you upload your ingredients
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {mockRecipes.map((recipe, index) => (
            <div
              key={recipe.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`bg-gradient-to-br ${recipe.gradient} rounded-2xl p-8 border-2 border-border/50 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg group`}>
                {/* Icon/Image Placeholder */}
                <div className="mb-6 relative">
                  <div className="w-full h-48 bg-card rounded-xl flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-300">
                    {recipe.icon}
                  </div>
                  
                  {/* Match Badge */}
                  <div className="absolute -top-3 -right-3 w-20 h-20 bg-success rounded-full flex flex-col items-center justify-center shadow-lg animate-pulse-glow">
                    <span className="text-2xl font-bold text-white">{recipe.match}%</span>
                    <span className="text-xs text-white/90">match</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-heading font-bold mb-3 text-foreground">
                  {recipe.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ChefHat className="w-4 h-4" />
                    <span>{recipe.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>{recipe.cuisine}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {recipe.description}
                </p>

                <Button 
                  variant="outline" 
                  className="w-full border-foreground/20 hover:bg-foreground hover:text-background transition-all"
                >
                  View Recipe
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExampleRecipes;
