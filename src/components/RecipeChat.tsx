import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Recipe, Ingredient } from '@/types/recipe';
import { ChatMessage } from '@/types/chat';
import { sendMessage } from '@/services/chat';
import { useToast } from '@/hooks/use-toast';
import VoiceControls from '@/components/VoiceControls';

let msgCounter = 0;

interface RecipeChatProps {
  recipe: Recipe;
  ingredients: Ingredient[];
  onClose: () => void;
  onRecipeUpdate: (updates: Partial<Recipe>, explanation: string) => void;
}

const RecipeChat = ({ recipe, ingredients, onClose, onRecipeUpdate }: RecipeChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your cooking assistant. I can help you modify this recipe if you're missing ingredients, want to adjust portions, or need cooking tips. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<{ update: any; explanation: string } | null>(null);
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: (++msgCounter).toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(textToSend, messages, recipe, ingredients);
      
      const assistantMessage: ChatMessage = {
        id: (++msgCounter).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLastAssistantMessage(response.message);

      // Check for recipe update
      if (response.recipeUpdate) {
        setPendingUpdate({
          update: response.recipeUpdate,
          explanation: response.recipeUpdate.explanation || 'Recipe modifications suggested',
        });
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: 'Chat error',
        description: error.message || 'Failed to get response',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyUpdate = () => {
    if (pendingUpdate) {
      onRecipeUpdate(pendingUpdate.update, pendingUpdate.explanation);
      setPendingUpdate(null);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInput(text);
    if (!isLoading) {
      handleSend(text);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-background border-l border-border shadow-2xl flex flex-col z-50 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <h3 className="font-display font-semibold text-lg">Recipe Assistant</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}

          {/* Pending Recipe Update Card */}
          {pendingUpdate && (
            <div className="glass-card rounded-xl p-4 border-2 border-accent/50 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Recipe Update Available</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {pendingUpdate.explanation}
                  </p>
                  <Button
                    onClick={handleApplyUpdate}
                    size="sm"
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about ingredients, portions, etc..."
            disabled={isLoading}
            className="flex-1"
          />
          <VoiceControls
            onTranscript={handleVoiceTranscript}
            speakText={lastAssistantMessage}
            autoListen={false}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick suggestions */}
        <div className="flex gap-2 mt-2 flex-wrap">
          <button
            onClick={() => handleSend("I'm missing an ingredient")}
            className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-muted/70 transition-colors"
            disabled={isLoading}
          >
            Missing ingredient
          </button>
          <button
            onClick={() => handleSend("Make this faster")}
            className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-muted/70 transition-colors"
            disabled={isLoading}
          >
            Make it faster
          </button>
          <button
            onClick={() => handleSend("Simplify this recipe")}
            className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-muted/70 transition-colors"
            disabled={isLoading}
          >
            Simplify
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeChat;
