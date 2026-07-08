# Misinformation Detector

A browser extension and web application that detects misinformation in real-time while you browse the web. Train your critical thinking skills in the gamified Arena and compete on the leaderboard.

## Features

### Arena (Web App)
- **Gamified Training**: Test your ability to identify real vs. fake headlines
- **Instant Feedback**: Get AI-powered analysis of each prediction
- **Scoring System**: Earn points for correct predictions and track your accuracy
- **Leaderboard**: Compete with other users globally
- **Dashboard**: View your statistics, accuracy rate, and progress over time

### Overlay (Browser Extension)
- **Real-time Detection**: Highlight potentially misleading claims while browsing
- **One-click Analysis**: Select any text and get instant fact-checking
- **Confidence Scores**: See how confident the AI is in its analysis
- **Reasoning**: Understand why a claim is flagged as misinformation
- **Source Citations**: View references and sources used for analysis

### Community Watch
- **Vote on Results**: Help improve AI predictions by voting on accuracy
- **Share Insights**: Contribute to a community-driven fact-checking database
- **Leaderboard**: Recognition for top contributors

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (Email + Password)
- **AI Analysis**: Google Gemini API
- **Browser Extension**: WXT (Framework for cross-browser extensions)
- **State Management**: Zustand
- **Data Fetching**: SWR

## Project Structure

```
.
├── app/                          # Next.js web app
│   ├── arena/                    # Arena game pages
│   ├── dashboard/                # User dashboard
│   ├── auth/                     # Authentication pages
│   └── api/                      # API routes
├── entrypoints/                  # Extension entry points
│   ├── background.ts             # Service worker
│   ├── content.ts                # Content script
│   ├── popup/                    # Extension popup
│   └── overlay/                  # Analysis overlay
├── lib/
│   ├── supabase/                 # Supabase client setup
│   ├── gemini.ts                 # Gemini API integration
│   ├── types.ts                  # TypeScript types
│   └── store.ts                  # Zustand store
├── components/                   # React components
│   ├── extension/                # Extension-specific components
│   └── providers/                # Context providers
└── wxt.config.ts                 # WXT configuration
```

## Database Schema

### profiles
- User profile information and statistics
- Tracks score, accuracy rate, prediction counts

### claims
- Training headlines and statements
- Marked as arena training or community submitted
- Contains correct answer for validation

### verification_results
- AI analysis results for each claim
- Includes prediction, confidence score, reasoning, and sources

### user_predictions
- User's predictions on training claims
- Tracks correctness for scoring

### community_votes
- Community feedback on AI predictions
- Helps improve and validate analysis

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm or npm
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Building the Extension

The browser extension is built automatically as part of the Next.js build process using WXT:

```bash
pnpm build
```

The extension bundle will be available in `.wxt/` directory for testing and deployment.

## Usage

### Web App
1. Sign up or log in
2. Visit the Arena to start training
3. Make predictions on various claims
4. Check your accuracy and compete on the leaderboard
5. View detailed statistics on your dashboard

### Browser Extension
1. Install the extension in your browser
2. While browsing, select any text/headline
3. The extension will analyze it and show results in an overlay
4. Vote on the accuracy of the AI's analysis

## API Endpoints

- `POST /api/analyze` - Analyze a claim with Gemini
- `POST /api/predictions` - Save user prediction
- `GET /api/predictions` - Get user's predictions
- `GET /api/claims` - Get training claims
- `GET /api/leaderboard` - Get top players
- `POST /api/seed-claims` - Seed database with training claims

## Environment Variables

### Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_GEMINI_API_KEY` - Google Gemini API key

### Optional
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` - Override for auth redirect (development)

## Development

### Database Setup
The database schema is set up via Supabase using the SQL migrations in the project. Run the seed endpoint to populate training data:

```bash
curl -X POST http://localhost:3000/api/seed-claims
```

### Testing the Extension
1. Build the extension: `pnpm build`
2. In Chrome: Settings → Extensions → Load unpacked → Select `.wxt/chrome-mv3-dev`
3. In Firefox: `about:debugging` → This Firefox → Load Temporary Add-on → Select the `.wxt/firefox-mv2-dev`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
