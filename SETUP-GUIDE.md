# Contact Form & Social Links Setup Guide

## ✅ What's Already Done

- ✅ Resend SDK installed and integrated
- ✅ Contact form API endpoint configured
- ✅ Email validation and error handling
- ✅ CORS headers for production deployment
- ✅ Fallback to demo endpoint if email not configured

## 🔗 Step 1: Update Social Media Links

Edit `src/config/site.ts` and replace the placeholder URLs:

```typescript
social: {
  linkedin: 'https://linkedin.com/company/YOUR-COMPANY',
  instagram: 'https://instagram.com/YOUR-HANDLE',
  x: 'https://x.com/YOUR-HANDLE',
}
```

## 📧 Step 2: Get Your Resend API Key

1. **Sign up at Resend** (free tier available):
   - Visit https://resend.com
   - Create account and verify email
   - Go to API Keys section
   - Create new API key
   - Copy it (starts with `re_`)

2. **Add to environment variables**:
   - Copy `.env.local.example` to `.env.local`
   - Replace `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual key
   - Update `CONTACT_EMAIL` with your email address

```bash
# .env.local
RESEND_API_KEY=re_your_actual_key_here
CONTACT_EMAIL=your-email@example.com
```

## 🧪 Step 3: Test Locally with Vercel CLI

```bash
# Install Vercel CLI globally (one time only)
npm i -g vercel

# Run local dev server with serverless functions
vercel dev
```

Then visit http://localhost:3000 and test the contact form!

## 🚀 Step 4: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: NovaraTutor landing page"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/novaratutor.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables:
     - `RESEND_API_KEY` = your Resend API key
     - `CONTACT_EMAIL` = your email address
   - Click "Deploy"

3. **Done!** Your site will be live at `https://your-project.vercel.app`

### Option B: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add environment variables when prompted
```

## 📱 Features Now Active

✅ **Contact form** - Sends real emails via Resend
✅ **Email notifications** - Receive submissions in your inbox
✅ **Validation** - Name, email, message validation
✅ **Error handling** - User-friendly error messages
✅ **Success feedback** - Toast notifications
✅ **Logging** - View submissions in Vercel logs
✅ **Fallback** - Works even if email fails (logs to console)

## 🔐 Security Best Practices

- ✅ Environment variables (not in code)
- ✅ Email validation with regex
- ✅ CORS headers configured
- ✅ API key never exposed to client
- ⚠️ Consider adding rate limiting for production
- ⚠️ Update CORS origin to your domain (in `api/contact.ts`)

## 💡 What Happens When Form is Submitted

1. **User fills form** → validates inputs
2. **Submits** → sends POST to `/api/contact`
3. **Serverless function** → validates again server-side
4. **Resend API** → sends formatted email
5. **Success** → user sees success toast
6. **You receive** → email with submission details

## 🛠️ Customization

### Change Email Template

Edit `api/contact.ts` around line 45 to customize the HTML email

### Change "From" Address

You'll need to verify your domain with Resend:

- Add DNS records in Resend dashboard
- Update `from:` field in `api/contact.ts`

### Store in Database

Add database logic in `api/contact.ts` after line 69

## 📞 Next Steps

1. Get Resend API key → https://resend.com
2. Update social links in `src/config/site.ts`
3. Test locally with `vercel dev`
4. Deploy to Vercel
5. Done! 🎉
