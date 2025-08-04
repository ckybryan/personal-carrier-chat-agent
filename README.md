# Career Conversation - TypeScript Version

This is a TypeScript port of the Python career conversation chatbot. It provides the same functionality as the original Python version but runs on Node.js with Express.js instead of Gradio.

**Learning Project**: This project was created as part of learning from the Udemy course by [Ed Donner](https://www.linkedin.com/in/eddonner). You can find the course [here](https://www.udemy.com/share/10dasB3@zE174MbYSFUi3hhv6wzxhjI7IcgVciRBPeWv8_yvDdgUJOLW_Y-8FOATBFGTHIX-/).

## Features

- AI-powered career conversation using OpenAI's GPT-4o-mini
- Tool integration for recording user details and unknown questions
- Push notifications via Pushover
- PDF parsing for LinkedIn profile data
- Web-based chat interface

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- OpenAI API key
- Pushover account and API keys (optional)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in this directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PUSHOVER_USER=your_pushover_user_key_here
   PUSHOVER_TOKEN=your_pushover_token_here
   ```

3. **Prepare your profile data:**
   - Add your `linkedin.pdf` file to the `me/` directory
   - Edit `me/summary.txt` with your career summary

4. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Key Differences from Python Version

1. **Web Framework**: Uses Express.js instead of Gradio
2. **Chat Interface**: Custom HTML/CSS/JavaScript interface instead of Gradio's UI
3. **PDF Processing**: Uses `pdf-parse` instead of `pypdf`
4. **HTTP Requests**: Uses `axios` instead of `requests`
5. **Environment Variables**: Uses `dotenv` package
6. **Type Safety**: Full TypeScript typing for better development experience
7. **Clean Architecture**: Separated concerns with modular TypeScript files
8. **Static Assets**: Organized CSS and JavaScript in separate files

## File Structure

```
├── src/                    # TypeScript source files
│   ├── app.ts             # Main chatbot logic and Me class
│   ├── server.ts          # Express.js web server
│   ├── tools.ts           # AI tool functions and definitions
│   └── types.ts           # TypeScript type definitions
├── public/                # Static web assets
│   ├── css/
│   │   └── styles.css     # Application styles
│   ├── js/
│   │   └── chat.js        # Client-side chat functionality
│   └── index.html         # Clean HTML structure
├── me/                    # Personal profile data
│   ├── linkedin.pdf       # Your LinkedIn profile as PDF
│   ├── summary.txt        # Your career summary text
│   └── README.md          # Profile setup instructions
├── dist/                  # Compiled TypeScript output
├── package.json           # Node.js dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── project.json           # Project structure documentation
```

## API Endpoints

- `GET /` - Serves the chat interface
- `POST /chat` - Handles chat messages
  - Request body: `{ message: string, history: Message[] }`
  - Response: `{ response: string }`

## Tool Functions

The chatbot includes two main tools:

1. **record_user_details** - Records when users provide contact information
2. **record_unknown_question** - Records questions the bot cannot answer

Both tools send push notifications via Pushover when triggered.

## Development

### Project Structure

The project follows a clean separation of concerns:

- **Backend (`src/`)**: TypeScript files for server logic, AI integration, and tool functions
- **Frontend (`public/`)**: Static assets with separated HTML, CSS, and JavaScript
- **Types (`src/types.ts`)**: Centralized type definitions for better type safety
- **Tools (`src/tools.ts`)**: AI tool functions and OpenAI API definitions

### Making Changes

1. **Backend Logic**: Edit files in `src/` directory
2. **Styling**: Update `public/css/styles.css`
3. **Frontend Behavior**: Modify `public/js/chat.js`
4. **HTML Structure**: Edit `public/index.html`

### Building and Running

```bash
# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Watch for TypeScript changes
npm run watch
```

To modify the chatbot behavior:

1. Edit the `Me` class in `src/app.ts`
2. Update tool functions in `src/tools.ts`
3. Modify the system prompt in the `systemPrompt()` method
4. Rebuild with `npm run build`

## Deployment

This TypeScript version can be deployed to various platforms:

- **Railway**: 
  - Set environment variables in Railway dashboard
  - The project includes `railway.json` configuration
  - Build command: `npm run build`
  - Start command: `npm start`
  - Health check endpoint: `/health`
- **Heroku**: Add a `Procfile` with `web: node dist/src/server.js`
- **Vercel**: May need serverless function adaptation
- **DigitalOcean App Platform**: Configure build and run commands
- **AWS/GCP/Azure**: Deploy as containerized application

### Railway Deployment Notes

1. **Environment Variables**: Set these in Railway dashboard:
   - `OPENAI_API_KEY` (required)
   - `PUSHOVER_USER` (optional)
   - `PUSHOVER_TOKEN` (optional)
   - `NODE_ENV=production`

2. **Build Process**: Railway will automatically run `npm install` and `npm run build`

3. **Troubleshooting Railway**:
   - Check the build logs for TypeScript compilation errors
   - Verify environment variables are set correctly
   - Use `/health` endpoint to test if server is running
   - Ensure your `me/` directory files are included in the deployment

Make sure to set environment variables in your deployment platform.

## Troubleshooting

1. **Module not found errors**: Run `npm install` to install dependencies
2. **TypeScript compilation errors**: Check `tsconfig.json` configuration
3. **Environment variables not loaded**: Ensure `.env` file exists and is properly formatted
4. **PDF parsing issues**: Verify `me/linkedin.pdf` exists and is readable
5. **Port already in use**: Change the PORT environment variable or kill existing processes
6. **Railway deployment failures**:
   - Check build logs for compilation errors
   - Verify environment variables are set in Railway dashboard
   - Test health endpoint: `your-app-url.railway.app/health`
   - Ensure OpenAI API key is valid and has credits

## License

MIT License - feel free to modify and use as needed.
