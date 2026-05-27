import { Camera, Sparkles, ChefHat } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Camera,
    title: 'Snap Your Ingredients',
    description: 'Take a photo of your fridge or pantry',
    color: 'primary',
  },
  {
    number: 2,
    icon: Sparkles,
    title: 'Get Smart Matches',
    description: 'AI analyzes and suggests perfect recipes',
    color: 'secondary',
  },
  {
    number: 3,
    icon: ChefHat,
    title: 'Cook with Confidence',
    description: 'Follow recipes with creative substitutions',
    color: 'accent',
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary' },
  accent: { bg: 'bg-accent/10', text: 'text-accent' },
};

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-display font-semibold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to culinary creativity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-border/50">
                {/* Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-foreground shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6 mt-4">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${colorClasses[step.color]?.bg ?? 'bg-primary/10'} transition-transform hover:rotate-12 duration-300`}>
                    <step.icon className={`w-10 h-10 ${colorClasses[step.color]?.text ?? 'text-primary'}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
