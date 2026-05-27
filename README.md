# 🍳 Recipe Remix

**Recipe Remix** is an AI-powered cooking assistant that transforms your fridge into a personalized recipe book. Simply snap a photo of your ingredients, and let Claude AI generate customized recipes across multiple cuisines, complete with step-by-step instructions, smart substitutions, and an interactive voice assistant.

Built for hackathons, optimized for demos, powered by cutting-edge AI.

---

## ✨ Features

### 🔍 **AI-Powered Ingredient Detection**
- Upload a photo of your fridge or pantry
- Claude Vision API automatically identifies ingredients
- Manual and voice input for additional ingredients

### 🌍 **Multi-Cuisine Recipe Generation**
- Get 6 recipe suggestions across 3 distinct world cuisines (Mediterranean, Asian, Mexican)
- Each recipe includes:
  - Cook time and difficulty level
  - Ingredient match percentage
  - 4-5 detailed cooking steps
  - Comprehensive ingredient lists

### 📋 **Interactive Cooking Mode**
- Step-by-step checklist for each recipe
- Check off steps as you cook
- Estimated time per step
- Save favorite recipes for later

### 💬 **AI Recipe Chat Assistant**
- Real-time recipe modifications via Claude AI
- Ask for ingredient substitutions
- Adjust portions, difficulty, or cooking methods
- Voice-enabled conversations with speech-to-text and text-to-speech

### 🎤 **Voice Controls**
- Hands-free ingredient input
- Voice commands during cooking
- AI assistant speaks back responses

### 🔄 **Smart Substitutions**
- Missing an ingredient? Get instant alternatives
- Context-aware substitution suggestions
- Maintains recipe integrity and flavor profiles

---

## 🛠️ Technologies

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Web Speech API** - Voice features (STT/TTS)

### Backend & AI
- **Supabase** - Database and Edge Functions
- **Claude API** (Anthropic) - Vision and text generation
  - `claude-sonnet-4-20250514` for recipes and chat
  - Claude Vision for ingredient detection
- **Deno** - Edge Functions runtime

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Anthropic API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aayanbothra/fridge-feast-ai.git
cd fridge-feast-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. **Set up Supabase**

Run the database migration:
```bash
# Using Supabase CLI
supabase db push
```

Deploy the Edge Functions:
```bash
cd supabase/functions

# Deploy each function
supabase functions deploy analyze-image
supabase functions deploy generate-recipes
supabase functions deploy generate-substitutions
supabase functions deploy recipe-chat
```

Set the Anthropic API key as a secret:
```bash
supabase secrets set ANTHROPIC_API_KEY=your_key_here
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:8080` to see the app in action!

---

## 📁 Project Structure

```
fridge-feast-ai/
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── ImageUpload.tsx
│   │   ├── IngredientList.tsx
│   │   ├── RecipeCard.tsx
│   │   ├── CookingInstructions.tsx
│   │   ├── RecipeChat.tsx
│   │   ├── VoiceControls.tsx
│   │   └── ...
│   ├── services/          # API service layer
│   │   ├── claude.ts      # Claude API integration
│   │   ├── chat.ts        # Chat functionality
│   │   └── database.ts    # Supabase queries
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── pages/             # Page components
├── supabase/
│   ├── functions/         # Edge Functions
│   │   ├── analyze-image/
│   │   ├── generate-recipes/
│   │   ├── generate-substitutions/
│   │   └── recipe-chat/
│   └── migrations/        # Database schema
└── public/                # Static assets
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous/public key |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key for Claude |

**Note**: The Anthropic API key is also required as a Supabase secret for Edge Functions.

---

## 🎯 Usage

1. **Upload Ingredients**: Take a photo of your fridge or pantry
2. **Review & Edit**: Verify detected ingredients, add manual entries or use voice input
3. **Generate Recipes**: Click "Find Recipes" to get 6 suggestions across 3 cuisines
4. **Choose Cuisine**: Browse Mediterranean, Asian, or Mexican recipe tabs
5. **Start Cooking**: Select a recipe and follow step-by-step instructions
6. **Chat with AI**: Ask for modifications, substitutions, or cooking tips
7. **Save Favorites**: Keep your best recipes for later

---

## 🧪 Testing

To test the Edge Functions directly:

```bash
# Test ingredient analysis
curl -X POST "YOUR_SUPABASE_URL/functions/v1/analyze-image" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"imageData":"base64_image_string"}'

# Test recipe generation
curl -X POST "YOUR_SUPABASE_URL/functions/v1/generate-recipes" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"ingredients":[{"name":"chicken","category":"protein"}]}'
```

---

## 🤝 Contributing

This project was built during a hackathon. Feel free to fork, improve, and submit pull requests!

---

## 👥 Team

- **Aayan Bothra**
- **Sohan Udumula**
- **Pranav Janga**
- **Nolan Ryan**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic** for the powerful Claude API
- **Supabase** for seamless backend infrastructure
- **Shadcn UI** for beautiful, accessible components

---

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the team members.

---

**Built with ❤️ and AI** 🤖🍳
