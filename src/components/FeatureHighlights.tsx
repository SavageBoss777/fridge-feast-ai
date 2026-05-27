import { Eye, ArrowLeftRight, Gauge, Beaker } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Ingredient Detection',
    description: 'Advanced AI vision recognizes ingredients instantly from any photo',
    color: 'primary',
  },
  {
    icon: ArrowLeftRight,
    title: 'Smart Substitutions',
    description: "Get creative alternatives when you're missing ingredients, backed by flavor science",
    color: 'secondary',
  },
  {
    icon: Gauge,
    title: 'Match Percentage',
    description: 'See exactly how well each recipe matches your available ingredients',
    color: 'accent',
  },
  {
    icon: Beaker,
    title: 'Science Explained',
    description: 'Understand why substitutions work with easy-to-read scientific reasoning',
    color: 'foreground',
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary' },
  accent: { bg: 'bg-accent/10', text: 'text-accent' },
  foreground: { bg: 'bg-foreground/10', text: 'text-foreground' },
};

const FeatureHighlights = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-display font-semibold text-foreground mb-4">
            Why Recipe Remix?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that make cooking effortless
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${colorClasses[feature.color]?.bg ?? 'bg-primary/10'} flex items-center justify-center`}>
                  <feature.icon className={`w-7 h-7 ${colorClasses[feature.color]?.text ?? 'text-primary'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
