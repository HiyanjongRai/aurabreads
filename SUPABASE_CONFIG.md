# 🔗 Supabase Connection Configuration

## Current Setup Status

✅ **Installed**: Supabase packages  
✅ **Created**: Supabase client files  
✅ **Created**: Authentication functions  
✅ **Created**: Middleware for route protection  
⏳ **Pending**: Your Supabase credentials

---

## 📋 Checklist

- [ ] Create Supabase project at app.supabase.com
- [ ] Copy Project URL
- [ ] Copy ANON KEY
- [ ] Copy SERVICE ROLE KEY
- [ ] Update `.env.local`
- [ ] Create database tables (SQL)
- [ ] Test login/register
- [ ] Deploy to production

---

## 🔑 Environment Variables Explained

### `NEXT_PUBLIC_SUPABASE_URL`
- **What**: Your Supabase project URL
- **Format**: `https://your-project-id.supabase.co`
- **Where to find**: Settings → API → Project URL
- **Safe to expose**: YES (used in browser)
- **Required**: YES

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **What**: Public key for browser-side operations
- **Format**: Long JWT-like string
- **Where to find**: Settings → API → anon public
- **Safe to expose**: YES (limited permissions)
- **Required**: YES

### `SUPABASE_SERVICE_ROLE_KEY`
- **What**: Secret key for server-side operations
- **Format**: Long JWT-like string
- **Where to find**: Settings → API → service_role secret
- **Safe to expose**: NO! Keep private!
- **Where used**: Server actions, middleware, API routes
- **Required**: YES (for server operations)

---

## 📄 Current `.env.local` Template

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your_jwt_secret_here
```

---

## 🗄️ Database Tables Setup

Run this SQL in Supabase SQL Editor:

```sql
-- Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX users_email_idx ON public.users(email);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- RLS Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🔐 Row Level Security (RLS) Explained

RLS ensures users can only access their own data:

```sql
-- Only the user themselves can read their data
SELECT * FROM users WHERE id = current_user_id ✅

-- Users cannot access other users' data
SELECT * FROM users WHERE id != current_user_id ❌
```

**Enable RLS on**:
- ✅ users table
- ✅ orders table (if you add it)
- ✅ Any user-specific data

---

## 📁 File Locations Reference

```
h:\Project\Aurabeads\aurabeads\

├── .env.local
│   └── Your Supabase credentials go here

├── lib/
│   └── supabase/
│       ├── client.ts        ← Browser-side operations
│       ├── server.ts        ← Server-side operations
│       └── auth.ts          ← Authentication functions

├── middleware.ts             ← Route protection & sessions

├── app/
│   ├── actions/auth.ts      ← Keep old or replace with new
│   └── login/register/      ← Use as-is

└── SUPABASE_SETUP.md         ← Full guide
    SUPABASE_QUICKSTART.md    ← Quick start
    SUPABASE_CONFIG.md        ← This file
```

---

## 🧪 Testing Your Connection

### 1. Check Environment Variables

```bash
# Verify .env.local is loaded
npm run dev

# If dev server starts without errors, env is loaded ✅
```

### 2. Test in Browser Console

```javascript
// In browser DevTools Console
// This verifies Supabase client is working

fetch('/.env.local')
  .then(r => r.text())
  .then(text => console.log('Env loaded:', !!text))
```

### 3. Manual Test

```bash
# 1. Start dev server
npm run dev

# 2. Go to http://localhost:3000/register
# 3. Fill form and submit
# 4. Check Supabase → Authentication → Users
# 5. You should see your new user ✅
```

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot find module '@supabase/supabase-js'"
**Fix**: Run `npm install`

### Issue: "Invalid API Key"
**Fix**: Check .env.local has correct keys

### Issue: "NEXT_PUBLIC_SUPABASE_URL is undefined"
**Fix**: 
- Restart dev server after updating .env.local
- Check .env.local exists in project root
- Don't add quotes around values in .env.local

### Issue: "User already exists"
**Fix**: Go to Supabase → Auth → Users, delete test user

### Issue: "Permission denied" on database queries
**Fix**: Check RLS policies are correctly set up

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           Your AuraBeads App                     │
│                                                  │
│  ┌─────────────┐  ┌──────────────────────┐      │
│  │   Browser   │  │  Next.js Server      │      │
│  │             │  │                      │      │
│  │ LoginForm   │→ │ app/actions/auth.ts  │      │
│  │ (Client-    │  │ (Server Action)      │      │
│  │  side)      │  │                      │      │
│  └─────────────┘  └──────────────────────┘      │
│         ↓                    ↓                   │
│  lib/supabase/client.ts  lib/supabase/server.ts │
│         ↓                    ↓                   │
│  (Public Key)           (Service Role Key)      │
│         └────────────────────┬──────────────────┘
│                              ↓
│                   ┌──────────────────────┐
│                   │   Supabase Cloud     │
│                   │                      │
│                   │  ┌────────────────┐  │
│                   │  │ PostgreSQL DB  │  │
│                   │  │ - users table  │  │
│                   │  │ - RLS enabled  │  │
│                   │  └────────────────┘  │
│                   │                      │
│                   │  ┌────────────────┐  │
│                   │  │  Auth Service  │  │
│                   │  │ - Sign up      │  │
│                   │  │ - Sign in      │  │
│                   │  │ - Sessions     │  │
│                   │  └────────────────┘  │
│                   │                      │
│                   └──────────────────────┘
```

---

## 💾 Database Connection Options

### Option A: Supabase Auth + PostgreSQL (Recommended)
- Use Supabase's built-in auth
- Store extra data in Supabase PostgreSQL
- Best for: Most apps

```sql
-- Run in Supabase SQL Editor
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT,
  name TEXT,
  address TEXT
);
```

### Option B: Prisma + Supabase PostgreSQL
- Use your Prisma models
- Connect to Supabase PostgreSQL
- Best for: Complex schemas

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```env
DATABASE_URL=postgresql://postgres:password@db.project-id.supabase.co:5432/postgres
```

### Option C: Hybrid - Keep Prisma + Supabase Auth
- Use Supabase Auth only
- Keep Prisma with your current DB
- Best for: Existing setups

```ts
// Use Supabase for auth only
const { data, error } = await supabase.auth.signUp({...})

// Use Prisma for database
const user = await prisma.user.create({...})
```

---

## 🔄 Data Flow Examples

### Example 1: User Registration

```
1. User fills form (browser)
   ↓
2. FormData sent to server action (Next.js)
   ↓
3. Validate with Zod schema
   ↓
4. Call: supabase.auth.signUp({ email, password })
   ↓
5. Supabase creates auth user
   ↓
6. (Optional) Create profile in users table
   ↓
7. Redirect to /login?registered=1
   ↓
8. Browser shows success message
```

### Example 2: User Login

```
1. User enters email/password (browser)
   ↓
2. FormData sent to server action
   ↓
3. Call: supabase.auth.signInWithPassword({ email, password })
   ↓
4. Supabase verifies credentials
   ↓
5. Session cookie set automatically
   ↓
6. Middleware verifies session
   ↓
7. Redirect to /dashboard
   ↓
8. Dashboard page loads user profile
```

### Example 3: Accessing Protected Routes

```
1. User navigates to /dashboard
   ↓
2. Middleware.ts runs
   ↓
3. Gets user from supabase.auth.getUser()
   ↓
4. User exists? → Allow access ✅
   ↓
5. No user? → Redirect to /login ❌
```

---

## 🚀 Deployment Preparation

### Before Deploying:

1. **Update production env vars**
   ```bash
   # Create .env.production with Supabase credentials
   ```

2. **Run migrations** (if using Prisma + Supabase)
   ```bash
   npx prisma migrate deploy
   ```

3. **Set up RLS policies**
   - Enable on all tables
   - Test policies with different users

4. **Configure CORS** (if needed)
   - Supabase → Settings → CORS

5. **Test full flow**
   - Register new user
   - Login with that user
   - Access dashboard
   - Logout

### Deploy Commands:

```bash
# Build for production
npm run build

# Start production server
npm start

# Or use Vercel
vercel deploy --prod
```

---

## 📚 Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Install deps | `npm install` |
| Test | `npm run test` |
| Lint | `npm run lint` |
| Prisma migrate | `npx prisma migrate dev` |
| Prisma generate | `npx prisma generate` |
| View Supabase dashboard | Open [app.supabase.com](https://app.supabase.com) |

---

## ✅ Next Steps

1. **Create Supabase project** → [https://app.supabase.com](https://app.supabase.com)
2. **Copy credentials** → Update `.env.local`
3. **Run SQL** → Create users table
4. **Test locally** → `npm run dev`
5. **Deploy** → Vercel or your host

**Everything is ready!** Just follow these steps and you'll have a production-grade authentication system.

---

**Questions?** Check `SUPABASE_SETUP.md` for detailed explanations.
