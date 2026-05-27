import { Recipe, Substitution } from './recipe';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recipeUpdate?: Partial<Recipe> & { explanation?: string };
  suggestedSubstitutions?: Substitution[];
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
}
