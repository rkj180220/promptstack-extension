# PromptStack Browser Extension

A Chrome Extension (Manifest V3) for the internal Prompt Library Marketplace. This extension allows employees to search, discover, add, rate, and insert prompts directly into ChatGPT, Perplexity, and GitHub Copilot chat windows.

## Features

### Core Functionality
- **Browse & Search**: Find prompts with advanced filtering by tags, domains, and sorting options
- **Add Prompts**: Create new prompts with tags, domains, and visibility controls
- **Copy & Insert**: Copy prompts to clipboard or insert directly into supported AI platforms
- **Rate & Comment**: Rate prompts (1-5 stars) and add comments for collaboration
- **Leaderboard**: View top contributors by prompt count, usage, and ratings
- **Settings**: Configure development authentication headers

### Supported Sites
- **ChatGPT** (chat.openai.com) - Inserts into main textarea
- **Perplexity** (www.perplexity.ai) - Inserts into main textarea  
- **GitHub** (github.com) - Inserts into Copilot chat or comment fields

### Visibility Modes
- **Organization**: Visible to all employees
- **Team**: Visible to members of selected teams
- **Domain**: Visible to users in selected business domains
- **Private**: Author only
- **Custom**: Explicit sharing with users, teams, or domains

## Prerequisites

- Node.js 18+ and npm
- Chrome browser for development
- Backend API running (see backend repository)

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For production, update this to your backend API URL.

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Build

```bash
npm run dev
```

This starts Vite in development mode with hot reloading.

### 3. Production Build

```bash
npm run build
```

This creates the `dist/` folder with all extension files.

### 4. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project
5. The PromptStack extension should now appear in your extensions

### 5. Configure Development Authentication

1. Click the PromptStack extension icon in Chrome
2. Go to the "Settings" tab
3. Enter your email and name for development mode
4. Click "Save Settings"

These headers (`X-User-Email` and `X-User-Name`) will be sent with all API requests for development authentication.

## Usage

### Browsing Prompts

1. Click the extension icon to open the popup
2. Use the search bar to find prompts
3. Filter by tags or sort by Most Used/Top Rated/Newest
4. Click on any prompt to expand details
5. Use Copy or Insert buttons to use the prompt

### Adding Prompts

1. Go to the "Add" tab in the extension popup
2. Fill in the required title and content
3. Optionally add description, tags, and domains
4. Select visibility mode and sharing options
5. Click "Add Prompt" to save

### Rating and Commenting

1. Expand any prompt in the Browse tab
2. Click 1-5 stars to rate the prompt
3. Add comments in the text field and click "Add"

### Leaderboard

1. Go to the "Leaders" tab to see top contributors
2. Shows prompt count, total usage, and average rating

## File Structure

```
├── manifest.json          # Chrome Extension Manifest V3
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite build configuration
├── tsconfig.json          # TypeScript configuration
├── src/
│   ├── api.ts            # Axios API client with auth headers
│   ├── background.ts     # Service worker for message handling
│   ├── contentScript.ts  # Content script for prompt insertion
│   ├── types.ts          # TypeScript type definitions
│   └── popup/
│       ├── index.html    # Popup HTML template
│       └── main.tsx      # React popup application
└── dist/                 # Built extension files (generated)
    ├── manifest.json
    ├── background.js
    ├── contentScript.js
    └── src/popup/
        └── index.html
```

## API Endpoints Used

The extension interacts with these backend endpoints:

- `GET /health` - Health check
- `GET /users/me` - Current user info
- `GET /prompts` - List prompts with filters
- `POST /prompts` - Create new prompt
- `GET /prompts/:id` - Get prompt details
- `POST /prompts/:id/use` - Increment usage count
- `POST /prompts/:id/rate` - Rate prompt
- `GET /prompts/:id/comments` - Get comments
- `POST /prompts/:id/comments` - Add comment
- `GET /teams` - List user's teams
- `GET /domains` - List domains
- `GET /leaderboard` - Get top contributors

## Content Script Behavior

The content script automatically detects and inserts prompts into:

### ChatGPT
- Primary: Main textarea element
- Fallback: Any contenteditable element

### Perplexity  
- Primary: Main textarea element

### GitHub
- Primary: Copilot chat contenteditable elements
- Fallback: Issue/PR comment textareas (`#new_comment_field`, `.js-comment-field`)

## Authentication

### Development Mode
- Uses `X-User-Email` and `X-User-Name` headers
- Configure in Settings tab of extension
- Headers are automatically added to all API requests

### Production Mode (Future)
- Will use JWT/OIDC authentication
- Tokens will be managed by the background script
- No manual configuration required

## Troubleshooting

### Extension Won't Load
- Ensure you've run `npm run build` first
- Check that you're loading the `dist/` folder, not the source
- Look for errors in Chrome DevTools console

### API Requests Failing
- Verify backend is running on the configured URL
- Check authentication headers are set in Settings
- Ensure CORS is configured in backend for `chrome-extension://*`

### Prompt Insertion Not Working
- Make sure you're on a supported site (ChatGPT, Perplexity, GitHub)
- Check that the page has loaded completely
- Try refreshing the page and attempting insertion again

### Build Errors
- Delete `node_modules/` and `dist/` folders
- Run `npm install` again
- Ensure Node.js version is 18+

## Architecture Notes

### Manifest V3 Compliance
- Uses service worker instead of background pages
- Content scripts are properly registered
- Permissions are minimal and specific

### State Management
- React hooks for local state
- localStorage for settings persistence
- No external state management library needed

### Styling
- Inline styles for simplicity and isolation
- Consistent design system with Tailwind-like utilities
- Responsive design for 400x600px popup

## Production Deployment

### Building for Production

1. Update `VITE_API_BASE_URL` in `.env` to production API
2. Run `npm run build`
3. The `dist/` folder contains the production extension

### Chrome Web Store (Future)

1. Zip the `dist/` folder contents
2. Upload to Chrome Web Store Developer Console
3. Complete store listing with screenshots and descriptions
4. Submit for review

### Enterprise Distribution

1. Package the `dist/` folder as a `.crx` file
2. Distribute through enterprise Chrome management
3. Configure force-install policies if needed

## Development Commands

```bash
# Install dependencies
npm install

# Development build with watch mode
npm run dev

# Production build
npm run build

# Type checking
npx tsc --noEmit

# Linting (if configured)
npm run lint
```

## Contributing

1. Ensure TypeScript types are properly defined
2. Follow existing code style and patterns
3. Test on all supported sites before submitting
4. Update this README if adding new features

## License

Internal use only - see company license policy.
