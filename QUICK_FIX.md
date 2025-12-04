# ⚡ Quick Fix Checklist - Chatbot Not Replying

## 🔧 What I Fixed

Your bot wasn't responding to text messages. I've added:

1. ✅ Text message handler (was only handling button clicks)
2. ✅ Fixed async/await with proper loop (was using forEach)
3. ✅ Better error logging
4. ✅ Environment variable validation

---

## 🚀 What You Need to Do Now

### 1️⃣ Restart Your Dev Server (5 seconds)

```bash
npm run dev
```

### 2️⃣ Check Environment Variables (2 minutes)

Verify `.env.local` file has:

```
FACEBOOK_ACCESS_TOKEN=your_actual_token
OPENAI_API_KEY=your_actual_key
WEBHOOK_VERIFY_TOKEN=your_verify_token
```

**Don't use:** Placeholder or example values

### 3️⃣ Send a Test Message (1 minute)

1. Open Facebook Messenger
2. Send message to your page: "Hello" or "Tell me about art"
3. Check http://localhost:3000/logs in browser
4. Look for your message in logs

### 4️⃣ Debug if Still Not Working (5 minutes)

Check `/logs` page for errors:

**You'll see something like:**

```
[INFO] Webhook received { object: "page" }
[ERROR] Facebook API error: 401 Unauthorized
```

The error message tells you what's wrong.

---

## 🎯 Common Errors & Quick Fixes

| Error                           | Meaning                     | Fix                             |
| ------------------------------- | --------------------------- | ------------------------------- |
| `401 Unauthorized`              | Token is wrong              | Update `FACEBOOK_ACCESS_TOKEN`  |
| `403 Forbidden`                 | Token needs permissions     | Check Facebook app permissions  |
| `Webhook received` but no reply | Environment vars not loaded | Restart dev server              |
| `OPENAI_API_KEY is not set`     | Key missing                 | Add to `.env.local` and restart |

---

## ✅ Verification

After fixes, you should see in `/logs`:

```
✓ [INFO] Webhook received
✓ [INFO] Facebook API response status: 200
✓ Bot replies in Messenger
```

---

## 📲 Test Commands

Send these to your bot:

```
"Hello"                    → Should reply with AI response
"Tell me about Picasso"    → Should give artist biography
```

---

**That's it! Your bot should now reply to messages. If not, check the `/logs` page for the exact error.** 🎉

See `TROUBLESHOOTING.md` for detailed debugging if issues persist.
