import { ArrowRight, Sparkles, Gauge } from 'lucide-react';
import { Substitution } from '@/types/recipe';
import { Button } from '@/components/ui/button';

interface SubstitutionPanelProps {
  recipeName: string;
  substitutions: Substitution[];
  onBack: () => void;
}

const SubstitutionPanel = ({ recipeName, substitutions, onBack }: SubstitutionPanelProps) => {
  const renderImpactDots = (impact: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= impact ? 'bg-warning' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
      >
        ← Back to recipes
      </Button>

      <div className="bg-card border border-border rounded-xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-warning" />
          <h2 className="text-3xl font-bold text-foreground">
            Smart Substitutions
          </h2>
        </div>

        <p className="text-lg mb-6 text-muted-foreground">
          For: <span className="font-bold text-foreground">{recipeName}</span>
        </p>

        <div className="space-y-6">
          {substitutions.map((sub) => (
            <div
              key={sub.original}
              className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="ingredient-chip protein">
                  {sub.original}
                </span>
                <ArrowRight className="w-5 h-5 text-warning" />
                <span className="ingredient-chip produce">
                  {sub.substitute}
                </span>
              </div>

              <div className="science-panel mb-4">
                <p className="leading-relaxed text-foreground/90">
                  {sub.flavorScience}
                </p>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-warning" />
                  <span className="text-muted-foreground">Flavor Impact:</span>
                  {renderImpactDots(sub.flavorImpact)}
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-warning" />
                  <span className="text-muted-foreground">Texture Impact:</span>
                  {renderImpactDots(sub.textureImpact)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubstitutionPanel;
