# Quick Start Guide - Next.js Conversion

## ✅ What Was Done

Your Express.js project has been successfully converted to a **Next.js project** with the following improvements:

### 1. **Framework Migration**

- ✅ Express.js → Next.js 14
- ✅ Old API routes → Next.js API routes
- ✅ Added React pages for UI

### 2. **Features Added**

- ✅ **Real-time Logs Dashboard** at `/logs`
  - View all webhook events and API calls
  - Auto-refresh capability
  - Download logs as JSON
  - Filter by log level (INFO, WARN, ERROR)
- ✅ **Home Page** at `/`
  - Project overview
  - API endpoint documentation
  - Environment setup instructions

### 3. **API Routes**

- `/api/webhook` - Facebook Messenger webhook (GET verification & POST events)
- `/api/test` - Test endpoint
- `/api/logs` - Get current logs as JSON

### 4. **File Structure**

```
project/
├── pages/
│   ├── api/
│   │   ├── webhook.js (handles FB Messenger)
│   │   ├── test.js
│   │   └── logs.js
│   ├── logs.js (real-time logs viewer)
│   ├── index.js (home page)
│   └── _app.js
├── lib/
│   ├── config.js
│   ├── services/ (ArtService, ResponseServices)
│   └── models/ (Artist, Painting)
├── styles/ (CSS)
├── next.config.js
├── tsconfig.json
├── vercel.json
└── .env.local.example
```

---

## 🚀 How to Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Deploy to Vercel
vercel

# Follow the interactive prompts:
# - Link to your GitHub account
# - Choose project name
# - Choose project directory (.)
# - Add environment variables when prompted
```

### Method 2: Using GitHub (CI/CD)

```bash
# 1. Push your code to GitHub
git add .
git commit -m "Convert to Next.js"
git push origin main

# 2. Go to https://vercel.com
# 3. Click "New Project"
# 4. Import your GitHub repository
# 5. Set environment variables in Vercel dashboard:
#    - FACEBOOK_ACCESS_TOKEN
#    - WEBHOOK_VERIFY_TOKEN
#    - OPENAI_API_KEY
# 6. Deploy
```

---

## 📝 Environment Variables Setup

### Local Development

```bash
# 1. Copy the example file
cp .env.local.example .env.local

# 2. Edit .env.local and add your keys:
FACEBOOK_ACCESS_TOKEN=your_facebook_token
WEBHOOK_VERIFY_TOKEN=your_verify_token
OPENAI_API_KEY=your_openai_key
```

### Vercel Deployment

Add these in Vercel project settings → Settings → Environment Variables:

```
FACEBOOK_ACCESS_TOKEN = your_facebook_token
WEBHOOK_VERIFY_TOKEN = your_verify_token
OPENAI_API_KEY = your_openai_key
```

---

## 🧪 Testing Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
# View logs at http://localhost:3000/logs
```

---

## 📊 Logs Dashboard Features

The `/logs` page provides:

1. **Real-time Monitoring**

   - Auto-refresh every 3 seconds
   - Toggle auto-refresh on/off

2. **Log Information**

   - Timestamp
   - Log level (INFO, WARN, ERROR)
   - Message description
   - Detailed data (expandable)

3. **Actions**

   - Download logs as JSON file
   - Clear logs
   - Manual refresh

4. **Log Types**
   - Webhook verification attempts
   - Message handling events
   - API calls and responses
   - Errors and exceptions

---

## 🔗 Facebook Messenger Setup

After deploying to Vercel:

1. **Get Your Webhook URL**

   - If deployed: `https://your-vercel-app.vercel.app/api/webhook`
   - Local testing: Use ngrok or similar service

2. **Update Facebook Developer Console**

   - Go to Your App → Messenger → Settings
   - Callback URL: `https://your-vercel-app.vercel.app/api/webhook`
   - Verify Token: Your `WEBHOOK_VERIFY_TOKEN`
   - Subscribe to webhook events:
     - messages
     - messaging_postbacks

3. **Verify Webhook in Console**
   - The endpoint will be verified automatically
   - Check `/logs` to see verification events

---

## 🎯 Next Steps

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Environment Variables**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Test Locally**

   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

4. **Deploy to Vercel**

   ```bash
   vercel
   ```

5. **Configure Facebook Webhook**
   - Update webhook URL in Facebook Developer Console
   - Test with sample messages
   - Monitor logs at `/logs`

---

## 📚 Documentation

For detailed information, see:

- `README-NEXTJS.md` - Complete documentation
- `next.config.js` - Next.js configuration
- `vercel.json` - Vercel deployment settings

---

## 🔧 Troubleshooting

### Webhook Not Working

- [ ] Check webhook URL in Facebook Developer Console
- [ ] Verify `WEBHOOK_VERIFY_TOKEN` matches
- [ ] Check `/logs` page for errors

### Environment Variables Not Loading

- [ ] Confirm `.env.local` file exists
- [ ] Restart dev server after changes
- [ ] For Vercel: Make sure variables are set in project settings

### Logs Not Appearing

- [ ] Refresh the `/logs` page
- [ ] Check auto-refresh is enabled
- [ ] Trigger a test webhook event

---

## ✨ Key Improvements Over Express Version

| Feature        | Express           | Next.js                            |
| -------------- | ----------------- | ---------------------------------- |
| Development    | Nodemon           | Next.js dev server with hot reload |
| Pages          | None              | Built-in React pages               |
| Logs Dashboard | None              | Real-time at `/logs`               |
| Deployment     | Manual setup      | One-click Vercel deploy            |
| Environment    | Manual management | Built-in .env support              |
| Performance    | Node.js server    | Optimized with Vercel serverless   |
| Monitoring     | Console logs only | Web dashboard                      |

---

**That's it! You now have a modern, Vercel-ready Next.js application with real-time logs monitoring. 🎉**
