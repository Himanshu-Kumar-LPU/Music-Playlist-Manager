# ⚡ Quick Deploy Guide (5 Minutes)

Your app is production-ready! Follow these quick steps based on your chosen platform.

---

## 🚀 Choose Your Platform

### **Option A: Railway (Recommended - Easiest)**

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → Select your GitHub repo
4. Railway auto-detects it's a Node.js app
5. Click "Deploy"
6. Go to Variables tab → Add these:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=kumarhimanshu9605@gmail.com
   EMAIL_PASSWORD=ydmr kznn fkgc xelc
   DEV_EMAIL_FALLBACK=false
   PORT=3000
   ```
7. Done! Your app is live at the Railway URL

**Time: 3 minutes**

---

### **Option B: Heroku**

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Run:
   ```bash
   heroku login
   heroku create your-app-name
   
   heroku config:set EMAIL_SERVICE=gmail
   heroku config:set EMAIL_USER=kumarhimanshu9605@gmail.com
   heroku config:set EMAIL_PASSWORD="ydmr kznn fkgc xelc"
   heroku config:set DEV_EMAIL_FALLBACK=false
   
   git push heroku main
   ```
3. View your app:
   ```bash
   heroku open
   ```

**Time: 5 minutes**

---

### **Option C: Render**

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Fill in:
   - **Name**: music-playlist-manager
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build:wasm && npm run build`
   - **Start Command**: `node server.js`
6. Go to Environment tab → Add these:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=kumarhimanshu9605@gmail.com
   EMAIL_PASSWORD=ydmr kznn fkgc xelc
   DEV_EMAIL_FALLBACK=false
   ```
7. Click "Deploy"

**Time: 4 minutes**

---

## ✅ Post-Deploy Testing

1. Visit your app URL (from Railway/Heroku/Render)
2. **Test Sign-Up**:
   - Enter any email
   - Enter a name
   - Click "Create account"
   - Check your email for OTP (should arrive in < 1 minute)
   - Enter OTP → Sign in
3. **Test Music Upload**:
   - Once logged in, go to Home
   - Click "Add Song"
   - Upload an MP3 file
   - Add it to playlist
4. **Test Persistence**:
   - Refresh the page
   - Your playlist should still be there

---

## 🔐 Security Reminders

- ✓ Your `.env.local` is in `.gitignore` - never committed
- ✓ Gmail App Password is safe (not your account password)
- ✓ `DEV_EMAIL_FALLBACK=false` enables real email (required for production)
- ✓ All credentials are in your platform's dashboard (Railway/Heroku/Render)

---

## 🆘 If Something Breaks

### OTP Not Sending?
- Check platform logs (Railway: Logs tab, Heroku: `heroku logs --tail`)
- Make sure `DEV_EMAIL_FALLBACK=false`
- Verify Gmail App Password is correct

### Blank Page?
- Check browser console (F12) for errors
- Verify backend is running (check logs)
- Clear browser cache

### Can't Sign In?
- Check if email service is configured
- Try `DEV_EMAIL_FALLBACK=true` to debug (changes in platform dashboard)
- Restart the app after changing variables

---

## 📚 Need More Details?

See `DEPLOYMENT.md` for full deployment guide with all platforms and advanced configuration.

---

**Your app is ready to deploy! 🎵🚀**
