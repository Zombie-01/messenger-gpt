# Deployment Checklist for Vercel

## Pre-Deployment Setup ✓

- [ ] Clone/pull latest code
- [ ] Run `npm install` to install dependencies
- [ ] Test locally: `npm run dev`
- [ ] Visit `http://localhost:3000` - should see home page
- [ ] Visit `http://localhost:3000/logs` - should see logs page
- [ ] Test API: `curl http://localhost:3000/api/test`

## Environment Variables Setup ✓

- [ ] Create `.env.local` file (copy from `.env.local.example`)
- [ ] Add `FACEBOOK_ACCESS_TOKEN`
- [ ] Add `WEBHOOK_VERIFY_TOKEN`
- [ ] Add `OPENAI_API_KEY`
- [ ] Restart dev server with `npm run dev`
- [ ] Confirm logs appear in `/logs` dashboard

## Code Preparation ✓

- [ ] Run `npm run build` - should complete without errors
- [ ] Check no TypeScript/ESLint errors: `npm run lint`
- [ ] Review `.gitignore` includes `.env.local` and `node_modules`
- [ ] Commit all changes: `git add . && git commit -m "Convert to Next.js"`
- [ ] Push to GitHub: `git push origin main`

## Vercel Deployment ✓

### Option A: Via Vercel CLI

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run: `vercel`
- [ ] Follow prompts:
  - Link to GitHub account
  - Select project name
  - Choose `.` as root directory
  - Skip environment variables (add after)
- [ ] Visit the generated URL

### Option B: Via GitHub

- [ ] Go to `https://vercel.com`
- [ ] Sign in with GitHub
- [ ] Click "New Project"
- [ ] Select your repository
- [ ] Configure project:
  - Framework: Next.js (auto-detected)
  - Root Directory: `.` (default)
- [ ] Click "Deploy"

## Environment Variables in Vercel ✓

After deployment, add environment variables:

1. Go to Vercel Dashboard → Your Project → Settings
2. Click "Environment Variables"
3. Add each variable:

   ```
   Name: FACEBOOK_ACCESS_TOKEN
   Value: [your token]
   Environments: Production, Preview, Development
   ```

   ```
   Name: WEBHOOK_VERIFY_TOKEN
   Value: [your token]
   Environments: Production, Preview, Development
   ```

   ```
   Name: OPENAI_API_KEY
   Value: [your key]
   Environments: Production, Preview, Development
   ```

4. Click "Save"
5. Vercel will redeploy automatically

## Facebook Configuration ✓

1. Go to Facebook Developer Console
2. Select your app → Messenger → Settings
3. In "Webhooks" section:
   - **Callback URL**: `https://your-vercel-app.vercel.app/api/webhook`
   - **Verify Token**: Your `WEBHOOK_VERIFY_TOKEN`
   - **Subscription Fields**: Select `messages`, `messaging_postbacks`
4. Click "Verify and Save"
5. Check Vercel logs for verification event

## Post-Deployment Testing ✓

- [ ] Test home page: `https://your-vercel-app.vercel.app`
- [ ] Test logs page: `https://your-vercel-app.vercel.app/logs`
- [ ] Test API: `curl https://your-vercel-app.vercel.app/api/test`
- [ ] Check logs page is working and collecting data

## Facebook Messenger Testing ✓

1. In Facebook Messenger, start a conversation with your bot
2. Send a test message
3. Check Vercel logs page for webhook event
4. Monitor deployment logs if issues occur

## Monitoring & Troubleshooting ✓

### View Logs in Vercel Dashboard

1. Go to Vercel → Your Project → Logs
2. You can see:
   - Function logs (API endpoint calls)
   - Build logs (deployment history)
   - Runtime logs (errors, console output)

### View Application Logs

1. Visit `https://your-vercel-app.vercel.app/logs`
2. This shows your custom application logs

### Common Issues

**Webhook Not Verifying?**

- [ ] Check callback URL is exactly correct
- [ ] Verify token matches `WEBHOOK_VERIFY_TOKEN`
- [ ] Check Vercel logs for errors
- [ ] Redeploy if you changed environment variables

**No Logs Appearing?**

- [ ] Ensure environment variables are set in Vercel
- [ ] Restart/redeploy to load new env vars
- [ ] Send a test message to trigger webhook
- [ ] Check `/logs` page auto-refresh is enabled

**Function Timeout?**

- [ ] Check OpenAI/Facebook API calls complete
- [ ] Increase timeout in Vercel settings if needed
- [ ] Monitor in Vercel Logs for slow operations

## Success Indicators ✓

- ✅ Home page loads: `https://your-app.vercel.app`
- ✅ Logs page loads: `https://your-app.vercel.app/logs`
- ✅ Webhook URL verified in Facebook Console
- ✅ Test message appears in logs within 3 seconds
- ✅ No errors in Vercel deployment logs

## Roll Back (if needed)

If you need to revert to the previous version:

```bash
git log --oneline
git revert [commit-hash]
git push origin main
# Vercel will auto-redeploy
```

---

**Note**: The first deployment may take 2-5 minutes. Subsequent deployments are faster.

For detailed documentation, see `README-NEXTJS.md` and `QUICKSTART.md`.
