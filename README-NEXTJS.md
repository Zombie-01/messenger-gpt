# Classical Art Webhook - Next.js Edition

A Next.js application that integrates Facebook Messenger with ChatGPT to provide information about classical artists and their paintings.

## Features

- **Facebook Messenger Integration**: Webhook-based integration with Facebook Messenger
- **ChatGPT Integration**: AI-powered responses about classical artists
- **Real-time Logs**: View application logs in real-time via the web dashboard
- **Vercel Ready**: Fully configured for Vercel deployment

## Project Structure

```
├── pages/
│   ├── api/
│   │   ├── webhook.js    # Facebook webhook endpoint
│   │   ├── test.js       # Test endpoint
│   │   └── logs.js       # Logs API endpoint
│   ├── _app.js           # Next.js app wrapper
│   ├── index.js          # Home page
│   └── logs.js           # Logs viewer page
├── lib/
│   ├── config.js         # Configuration
│   ├── services/         # Business logic services
│   └── models/           # Data models
├── styles/               # CSS files
├── public/               # Static files
├── .env.local.example    # Environment variables template
└── vercel.json          # Vercel configuration
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Facebook Developer Account
- OpenAI API Key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Facebook-Messenger-ChatGPT-Integration
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your API keys:

```
FACEBOOK_ACCESS_TOKEN=your_token_here
WEBHOOK_VERIFY_TOKEN=your_verify_token_here
OPENAI_API_KEY=your_openai_key_here
```

### Local Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

- **Home Page**: [http://localhost:3000](http://localhost:3000)
- **Logs Page**: [http://localhost:3000/logs](http://localhost:3000/logs)
- **Webhook**: `POST http://localhost:3000/api/webhook`
- **Test Endpoint**: `GET http://localhost:3000/api/test`

### Production Build

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

3. Follow the prompts to configure your project

### Option 2: Using GitHub

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy

### Vercel Environment Variables

Set these variables in your Vercel project settings:

- `FACEBOOK_ACCESS_TOKEN`: Your Facebook API access token
- `WEBHOOK_VERIFY_TOKEN`: Your webhook verification token
- `OPENAI_API_KEY`: Your OpenAI API key

## API Endpoints

### POST /api/webhook

Webhook endpoint for Facebook Messenger events.

**Query Parameters (GET)**:

- `hub.mode`: Subscribe mode
- `hub.verify_token`: Verification token
- `hub.challenge`: Challenge string

**Request Body (POST)**:

```json
{
  "object": "page",
  "entry": [
    {
      "messaging": [
        {
          "sender": { "id": "user_id" },
          "postback": { "payload": "GET_STARTED" }
        }
      ]
    }
  ]
}
```

### GET /api/test

Simple test endpoint that returns `{ "message": "Success" }`

### GET /api/logs

Returns current application logs in JSON format.

## Logs Dashboard

The application includes a real-time logs dashboard at `/logs` that displays:

- All webhook events
- API calls and responses
- Errors and warnings
- Auto-refresh capability
- Download logs as JSON
- Clear logs

## Configuration

### config.js

Located at `lib/config.js`, contains all API endpoints and configuration values.

Environment variables can be used to override default values:

- `FACEBOOK_ACCESS_TOKEN`
- `OPENAI_API_KEY`
- `WEBHOOK_VERIFY_TOKEN`

## Services

### ResponseService

Handles Facebook Messenger message responses and interactions.

### ArtService

Manages artist data fetching and ChatGPT integration for biographical information.

## Models

- **Artist**: Represents a classical artist
- **Painting**: Represents a painting with metadata
- **ResponseBody**: Constructs Facebook Messenger message payloads

## Logging

The application automatically logs:

- Webhook verification attempts
- Message handling events
- API calls and responses
- Errors and warnings

Logs are stored in memory and displayed on the `/logs` page.

## License

ISC

## Author

@Saint.Reux

## Troubleshooting

### Webhook Not Receiving Events

- Verify your webhook URL is correct in Facebook Developer Console
- Check that `WEBHOOK_VERIFY_TOKEN` matches your Facebook configuration
- View logs at `/logs` to see verification attempts

### ChatGPT Integration Not Working

- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient quota
- Review error logs in the dashboard

### Logs Not Appearing

- Ensure webhook events are being sent
- Check browser auto-refresh is enabled
- Try manually refreshing the logs page

## Support

For issues or questions, please create an issue in the repository.
