import { ChefHat, Sparkles, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative hero-gradient py-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-20 animate-float">
        <ChefHat className="w-32 h-32 text-primary" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-24 h-24 text-secondary" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <Zap className="w-4 h-4" />
            <span>Powered by AI & Flavor Science</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-semibold leading-tight">
            Turn Your Ingredients Into
            <span className="gradient-text block mt-2">Delicious Recipes</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Snap a photo of your fridge, get AI-powered recipe suggestions, and discover creative substitutions with scientific explanations.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span>Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
              <span>Smart Substitutions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" style={{ animationDelay: '1s' }} />
              <span>Flavor Science</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
