import { useState, useRef } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeImage } from '@/services/claude';
import { Ingredient } from '@/types/recipe';

interface ImageUploadProps {
  onImageAnalyzed: (ingredients: Ingredient[]) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const ImageUpload = ({ onImageAnalyzed, isAnalyzing, setIsAnalyzing }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image under 20MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      setPreview(base64Image);
      
      // Analyze image with Claude
      setIsAnalyzing(true);
      try {
        const ingredients = await analyzeImage(base64Image);
        onImageAnalyzed(ingredients);
        toast({
          title: "Success!",
          description: `Found ${ingredients.length} ingredients in your image`,
        });
      } catch (error) {
        console.error('Error analyzing image:', error);
        toast({
          title: "Analysis failed",
          description: "Could not analyze the image. Please try again.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-scale-in">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`
          relative glass-card rounded-3xl p-16
          transition-all duration-500 cursor-pointer
          ${isDragging 
            ? 'border-primary border-2 bg-primary/10 scale-105 shadow-2xl' 
            : 'hover:border-primary/60 hover:scale-[1.02] hover:shadow-xl'
          }
          ${isAnalyzing ? 'pointer-events-none opacity-60' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {preview && !isAnalyzing ? (
          <div className="space-y-6 animate-fade-in">
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-80 mx-auto rounded-2xl shadow-2xl ring-2 ring-primary/20"
              />
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                <span className="text-2xl">✓</span>
              </div>
            </div>
            <p className="text-center text-base text-muted-foreground font-medium">
              Perfect! Click to upload a different image
            </p>
          </div>
        ) : (
          <div className="text-center space-y-6">
            {isAnalyzing ? (
              <>
                <div className="relative">
                  <Loader2 className="w-20 h-20 mx-auto text-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-foreground">
                    Analyzing your ingredients...
                  </p>
                  <p className="text-base text-muted-foreground">
                    Our AI is identifying everything in your photo
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="flex justify-center gap-8 mb-2">
                    <div className="relative">
                      <Upload className="w-16 h-16 text-primary animate-float" />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center text-xs">
                        1
                      </div>
                    </div>
                    <div className="relative">
                      <Camera className="w-16 h-16 text-secondary animate-float" style={{ animationDelay: '1s' }} />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center text-xs">
                        2
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-foreground">
                    Upload Your Ingredients
                  </p>
                  <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Snap a photo of your fridge, pantry, or countertop • Drag & drop • or click below
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Choose Photo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground/70">
                  Works with JPG, PNG, HEIC • Max 20MB
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
