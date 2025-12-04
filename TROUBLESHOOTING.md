# Chatbot Not Replying - Troubleshooting Guide

## ✅ Fixes Applied

I've fixed the following issues in your code:

### 1. **Added Text Message Handler**

- Previous: Only handled postback events (button clicks)
- Fixed: Now responds to regular text messages
- File: `lib/services/ResponseServices.js`

### 2. **Fixed Async Race Condition**

- Previous: Used `forEach` with `async/await` (doesn't wait)
- Fixed: Changed to `for...of` loops (properly waits)
- Impact: Messages are now processed sequentially

### 3. **Better Error Handling**

- Added try-catch blocks around message processing
- Added error logging for API calls
- Better error messages from OpenAI

### 4. **API Request Debugging**

- Logs API URLs (with token masked)
- Logs response status codes
- Logs API errors with details

---

## 🔍 Debugging Steps

### Step 1: Check Environment Variables

Make sure your `.env.local` file has:

```bash
FACEBOOK_ACCESS_TOKEN=your_real_token_here
OPENAI_API_KEY=your_real_key_here
WEBHOOK_VERIFY_TOKEN=your_verify_token_here
```

**How to verify:**

```bash
# In development
npm run dev
# Visit http://localhost:3000/logs
# Check if you see any error messages
```

### Step 2: Check Facebook Token

In Vercel logs, look for this message:

```
"Facebook API error: 401"
```

This means **invalid or expired access token**.

**Solution:**

1. Go to Facebook Developer Console
2. Select your app → Tools → Get Access Token
3. Copy the new token
4. Update in Vercel Environment Variables
5. Redeploy

### Step 3: Check Webhook Subscription

Facebook must be subscribed to your webhook events.

**Verify:**

1. Facebook Developer Console
2. Your App → Messenger → Settings
3. Under "Webhooks":
   - Callback URL must be correct
   - Verify Token must match
   - ✓ messages
   - ✓ messaging_postbacks
   - ✓ message_echoes (optional)

### Step 4: Monitor Logs in Real-Time

Visit: `http://localhost:3000/logs`

Look for patterns:

**✅ Successful Flow:**

```
[INFO] Webhook received
[INFO] Message handled successfully
[INFO] Facebook API response: {...}
```

**❌ Problem: No webhook received**

- Check if Facebook has correct callback URL
- Check if webhook is subscribed to message events

**❌ Problem: API returns 401 (Unauthorized)**

- Token is invalid or expired
- Refresh token in Facebook Console

**❌ Problem: API returns 403 (Forbidden)**

- Token doesn't have right permissions
- Add required permissions in Facebook app

**❌ Problem: OpenAI error**

- API key invalid
- Quota exceeded
- API key doesn't have permission

---

## 🧪 Test Scenarios

### Test 1: Webhook is Connected

1. Send a message on your Facebook page
2. Check `/logs` page
3. You should see `[INFO] Webhook received`

**If not:**

- Facebook isn't sending webhooks
- Check callback URL
- Check webhook subscriptions

### Test 2: API Authentication

1. Send a message
2. Check `/logs` for Facebook API response
3. Should show status 200, not 401/403

**If showing 401:**

- Token is wrong/expired
- Update `FACEBOOK_ACCESS_TOKEN`

### Test 3: Message Processing

1. Send message: "Tell me about Picasso"
2. Bot should respond with biography
3. Check `/logs` for response details

**If no response:**

- OpenAI API not configured
- OpenAI quota exceeded
- Check logs for OpenAI error

### Test 4: Error Messages

1. Send a message
2. If you see error in logs, read it carefully
3. It will tell you what's wrong

---

## 📋 Verification Checklist

- [ ] `.env.local` file exists (locally)
- [ ] `FACEBOOK_ACCESS_TOKEN` is set (not hardcoded in config.js)
- [ ] `OPENAI_API_KEY` is set
- [ ] `WEBHOOK_VERIFY_TOKEN` is set
- [ ] Facebook callback URL is correct (ends with `/api/webhook`)
- [ ] Facebook webhook is verified (green checkmark)
- [ ] Facebook subscribed to `messages` event
- [ ] Dev server running: `npm run dev`
- [ ] `/logs` page shows webhook events
- [ ] Facebook API returns status 200 (not 401/403)

---

## 🚀 Common Issues & Solutions

### Issue: "OPENAI_API_KEY is not set"

**Cause:** Environment variable not loaded

**Solution:**

```bash
# 1. Make sure .env.local has this line:
OPENAI_API_KEY=sk-...

# 2. Restart dev server:
npm run dev

# 3. For Vercel, add in project settings
```

### Issue: Facebook returns 401 Unauthorized

**Cause:** Invalid or expired token

**Solution:**

```
1. Go to Facebook Developer Console
2. Tools → Get Access Token
3. Copy new token
4. Update FACEBOOK_ACCESS_TOKEN
5. Restart dev server
```

### Issue: Message received but no response

**Cause:** Could be several reasons

**Debug:**

1. Check `/logs` for errors
2. Look at the error message
3. It will tell you what's wrong
4. Fix and restart

### Issue: "Module not found" error

**Solution:**

```bash
npm install
npm run dev
```

---

## 📊 How It Works Now

```
User sends message
    ↓
Facebook webhook POST /api/webhook
    ↓
handleReceivedMessage processes message
    ↓
Check if text message (not postback)
    ↓
Call fetchLearnMoreInfo(text)
    ↓
OpenAI generates response
    ↓
sendApi() sends response to Facebook
    ↓
Facebook delivers to user
```

---

## 🆘 Still Not Working?

If still not replying after these fixes:

1. **Check logs** at `http://localhost:3000/logs`
2. **Copy the error** message exactly
3. **Verify each component:**

   - [ ] Test OpenAI API directly
   - [ ] Test Facebook API directly
   - [ ] Check network requests

4. **Send test webhook:**

   ```bash
   curl -X POST http://localhost:3000/api/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "object": "page",
       "entry": [{
         "messaging": [{
           "sender": {"id": "123"},
           "message": {"text": "hello"}
         }]
       }]
     }'
   ```

5. **Check response** in `/logs`

---

## 📝 Files Modified

- `lib/services/ResponseServices.js` - Added text message handler
- `lib/services/ArtService.js` - Better error handling
- Added better logging throughout

Your chatbot should now reply to text messages! 🎉
