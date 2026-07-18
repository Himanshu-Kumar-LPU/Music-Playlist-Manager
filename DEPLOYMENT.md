# 🚀 Deployment Guide

This guide covers deploying the Music Playlist Manager to various hosting platforms.

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured (`.env.local`)
- [ ] WASM module built: `npm run build:wasm`
- [ ] Production build tested: `npm run build && npm run preview`
- [ ] Email service credentials ready (Gmail App Password or SMTP)
- [ ] SSL/HTTPS certificate ready (if required)
- [ ] Database/file storage plan decided (users.json for small scale, database for production)

---

## 🌐 Deployment Options

### Option 1: Heroku (Simple Full-Stack)

**Pros**: Easy deployment, free tier available, includes Node.js runtime  
**Cons**: Dyno sleeping, limited file storage

#### Steps

1. **Create Heroku Account** and install CLI:
   ```bash
   brew install heroku/brew/heroku  # macOS
   # OR
   choco install heroku-cli          # Windows
   ```

2. **Initialize Heroku App**:
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Add Environment Variables**:
   ```bash
   heroku config:set EMAIL_SERVICE=gmail
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-app-password
   heroku config:set DEV_EMAIL_FALLBACK=false
   heroku config:set PORT=5000
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **View Live**:
   ```bash
   heroku open
   ```

6. **View Logs**:
   ```bash
   heroku logs --tail
   ```

---

### Option 2: Railway (Modern Alternative)

**Pros**: Better performance than Heroku, generous free tier, fast deployments  
**Cons**: Different pricing model

#### Steps

1. **Connect GitHub**:
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Select your repository

2. **Configure Variables**:
   - In Railway dashboard, go to Variables
   - Add all `.env` variables:
     - `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`
     - `DEV_EMAIL_FALLBACK=false`
     - `PORT=3000` (Railway assigns a port)

3. **Deploy**:
   - Push to GitHub main branch
   - Railway auto-deploys

4. **View Logs**:
   - Use Railway dashboard

---

### Option 3: Render (Free Node Hosting)

**Pros**: Always-on free tier, Node.js optimized  
**Cons**: Shared resources

#### Steps

1. **Create Render Account** at [render.com](https://render.com)

2. **Connect GitHub**:
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository

3. **Configure Service**:
   - **Name**: your-app-name
   - **Environment**: Node
   - **Build Command**: 
     ```bash
     npm install && npm run build:wasm && npm run build
     ```
   - **Start Command**: 
     ```bash
     node server.js
     ```

4. **Add Environment Variables**:
   - In "Environment" section:
     - `EMAIL_SERVICE=gmail`
     - `EMAIL_USER=your-email@gmail.com`
     - `EMAIL_PASSWORD=your-app-password`
     - `DEV_EMAIL_FALLBACK=false`

5. **Deploy**:
   - Click "Deploy"

---

### Option 4: AWS (Scalable Production)

**Pros**: Highly scalable, production-ready  
**Cons**: More complex setup, requires AWS knowledge

#### Steps

1. **Frontend on S3 + CloudFront**:
   ```bash
   # Build
   npm run build:wasm
   npm run build
   
   # Upload to S3
   aws s3 sync dist/ s3://your-bucket-name/
   ```

2. **Backend on EC2**:
   ```bash
   # SSH into EC2
   ssh -i your-key.pem ec2-user@your-instance-ip
   
   # Install Node.js
   curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
   sudo yum install nodejs
   
   # Clone repo and deploy
   git clone <your-repo>
   cd mu
   npm install
   npm run build:wasm
   
   # Set environment variables
   nano .env.local
   # Add your credentials
   
   # Start with PM2 (process manager)
   npm install -g pm2
   pm2 start server.js --name "music-api"
   pm2 save
   ```

3. **Configure Security**:
   - Update S3 bucket policy for CloudFront
   - Configure EC2 security group (port 4000)
   - Set up SSL with ACM

---

### Option 5: Docker + Any Cloud

**Pros**: Portable, consistent across environments  
**Cons**: Requires Docker knowledge

#### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install Emscripten dependencies (if building WASM)
RUN apk add --no-cache python3 make

COPY package*.json ./
RUN npm install

COPY . .

# Build WASM and frontend
RUN npm run build:wasm
RUN npm run build

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "server.js"]
```

#### Build & Deploy

```bash
# Build Docker image
docker build -t music-playlist-manager .

# Run locally to test
docker run -p 4000:4000 \
  -e EMAIL_SERVICE=gmail \
  -e EMAIL_USER=your-email@gmail.com \
  -e EMAIL_PASSWORD=your-app-password \
  music-playlist-manager

# Push to Docker Hub
docker tag music-playlist-manager username/music-playlist-manager
docker push username/music-playlist-manager

# Deploy to any cloud platform (GCP Cloud Run, Azure Container Instances, etc.)
```

---

### Option 6: Vercel (Frontend Only)

**Pros**: Optimized for React/frontend, built-in CDN  
**Cons**: Backend needs separate hosting

#### Steps

1. **Deploy Frontend to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Deploy Backend Separately**:
   - Use Heroku, Railway, or Render for the backend

3. **Update Proxy**:
   - Edit `vite.config.js` to point to your backend URL:
     ```javascript
     '/api': {
       target: 'https://your-backend-domain.com',
       changeOrigin: true,
     }
     ```
   - Rebuild and redeploy frontend

---

## 🔧 Production Checklist

### Performance Optimization

- [ ] Enable GZIP compression in production
- [ ] Set up CDN for static assets
- [ ] Use production build (`npm run build`)
- [ ] Enable browser caching headers

### Security

- [ ] Use HTTPS/SSL (mandatory for auth)
- [ ] Set secure email credentials (use environment variables only)
- [ ] Enable CORS properly (limit to your domain)
- [ ] Implement rate limiting for OTP requests
- [ ] Use secure cookies (HttpOnly, Secure, SameSite)

### Monitoring

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Monitor server logs
- [ ] Track email delivery rates
- [ ] Monitor database/file storage usage

### Backups

- [ ] Regular backups of `users.json` (or migrate to MongoDB/PostgreSQL)
- [ ] Backup user-uploaded audio files

---

## 🔐 Email Configuration for Production

### Gmail (Recommended for small apps)

1. Enable 2-Step Verification
2. Generate [App Password](https://myaccount.google.com/apppasswords)
3. Use the 16-character password in `.env`

### Custom SMTP Server

Use these settings for your mail provider:

```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@your-domain.com
EMAIL_PASSWORD=your-password
```

### SendGrid / AWS SES

Modify `server.js` to use their SDKs instead of Nodemailer:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

---

## 📊 Database Migration (Optional)

For production with many users, migrate from `users.json` to MongoDB or PostgreSQL:

1. **Install MongoDB/PostgreSQL**
2. **Update `server.js`** to use database queries instead of file I/O
3. **Migrate existing data**:
   ```bash
   npm run migrate:db
   ```

---

## 🆘 Troubleshooting Deployment

### Blank Page / 404

- Check `vite.config.js` proxy configuration
- Verify backend is running
- Check browser console for errors
- Check server logs: `docker logs` or `heroku logs --tail`

### OTP Not Sending

- Verify email credentials in environment variables
- Check email service logs (Gmail Activity, SendGrid Dashboard)
- Test locally with `DEV_EMAIL_FALLBACK=true`
- Check server logs for error messages

### Build Fails

- Clear `node_modules`: `rm -rf node_modules && npm install`
- Rebuild WASM: `npm run build:wasm`
- Check for Node.js version compatibility (need 20+)

### High Memory Usage

- WASM module may require significant memory
- Consider using smaller audio files
- Optimize IndexedDB storage

---

## 📈 Scaling Tips

1. **Use a Database** instead of JSON file for users
2. **Enable Caching** headers for static assets
3. **Use CDN** for frontend distribution
4. **Implement API Rate Limiting** to prevent abuse
5. **Monitor Performance** and optimize bottlenecks
6. **Consider Serverless Functions** for OTP logic (AWS Lambda, Vercel Functions)

---

## 📝 Post-Deployment

- [ ] Test all features in production (sign up, OTP, music upload, etc.)
- [ ] Monitor error logs daily
- [ ] Set up automated backups
- [ ] Document deployment steps for your team
- [ ] Plan maintenance windows for updates

---

**For additional help**, check your platform's documentation or open an issue on GitHub.
