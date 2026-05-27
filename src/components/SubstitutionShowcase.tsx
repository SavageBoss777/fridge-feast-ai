import { ArrowRight, Star, X, Check } from 'lucide-react';

const SubstitutionShowcase = () => {
  const renderImpactStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i <= count ? 'fill-warning text-warning' : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-display font-semibold text-foreground mb-4">
            Substitution Magic in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how our AI finds creative alternatives backed by science
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-10 shadow-2xl animate-slide-up border-2 border-primary/10">
            {/* Substitution Visual */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
              {/* Original Ingredient */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="ingredient-chip protein text-lg px-6 py-3 shadow-lg">
                    <span className="font-semibold">Heavy Cream</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center shadow-md">
                    <X className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">Missing</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <div className="bg-secondary/20 rounded-full p-4">
                  <ArrowRight className="w-10 h-10 text-secondary" />
                </div>
              </div>

              {/* Substitute Ingredient */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="ingredient-chip produce text-lg px-6 py-3 shadow-lg">
                    <span className="font-semibold">Greek Yogurt + Milk</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-center text-sm text-primary font-medium mt-2">Available</p>
              </div>
            </div>

            {/* Science Explanation */}
            <div className="science-panel mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="leading-relaxed text-foreground/90">
                The fat content of Greek yogurt combined with milk mimics cream's richness while adding tangy depth. The protein structure provides similar body, and the slight acidity actually enhances flavors in most dishes. This substitution works particularly well in sauces and baked goods.
              </p>
            </div>

            {/* Impact Indicators */}
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Flavor Impact</span>
                  <span className="text-xs text-muted-foreground">Excellent</span>
                </div>
                {renderImpactStars(4)}
              </div>
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Texture Impact</span>
                  <span className="text-xs text-muted-foreground">Good</span>
                </div>
                {renderImpactStars(3)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubstitutionShowcase;
