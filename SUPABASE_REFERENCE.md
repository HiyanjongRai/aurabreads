# 📋 Supabase Connection - Visual Quick Reference

## 🎯 Your Checklist (Do This Now)

```
┌─────────────────────────────────────────────────────────┐
│  [ ] Step 1: Go to https://app.supabase.com            │
│  [ ] Step 2: Create new project                         │
│  [ ] Step 3: Go to Settings → API                       │
│  [ ] Step 4: Copy 3 values (URL, ANON KEY, ROLE KEY)   │
│  [ ] Step 5: Open .env.local and paste them            │
│  [ ] Step 6: Copy SQL from SUPABASE_SETUP.md           │
│  [ ] Step 7: Run SQL in Supabase SQL Editor            │
│  [ ] Step 8: Run: npm run dev                          │
│  [ ] Step 9: Test at http://localhost:3000/register    │
│  [ ] Step 10: Check Supabase → Auth → Users            │
│                                                         │
│  ✅ DONE! Your Supabase is connected!                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Where to Find Your Credentials

### In Supabase Dashboard:

```
Supabase → Your Project → Settings → API

┌──────────────────────────────────┐
│  Project URL                      │
│  Copy: https://xxx.supabase.co   │
│  ↓ Goes to NEXT_PUBLIC_SUPABASE_URL
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Key: anon public                │
│  Copy: eyJhbGc...                │
│  ↓ Goes to NEXT_PUBLIC_SUPABASE_ANON_KEY
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Key: service_role (secret)      │
│  Copy: eyJhbGc...                │
│  ↓ Goes to SUPABASE_SERVICE_ROLE_KEY (KEEP SECRET!)
└──────────────────────────────────┘
```

---

## 📝 Paste Into `.env.local`

```env
# Copy from Supabase → Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Copy from Supabase → Settings → API → anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Copy from Supabase → Settings → API → service_role secret (SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT**: 
- Don't share `.env.local`
- Add `.env.local` to `.gitignore`
- `NEXT_PUBLIC_` prefix = safe to expose
- No prefix = KEEP SECRET!

---

## 🗄️ SQL to Run (Copy & Paste)

**In Supabase → SQL Editor → New Query**:

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

-- Index
CREATE INDEX users_email_idx ON public.users(email);

-- Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

Then click **"Run"** button.

---

## 🧪 Test It Works

```bash
# Terminal
npm run dev

# Browser
http://localhost:3000/register

# Fill form:
Name: John Doe
Address: 123 Main St
Email: john@example.com
Password: TestPass123

# Click: Create account

# Check Supabase:
Supabase → Authentication → Users
↓
You should see john@example.com ✅
```

---

## 🔗 File Map

```
┌─ .env.local ─────────┐
│ Your credentials      │
│ UPDATE THIS!          │
└──────────────────────┘
         ↓
┌─ lib/supabase/───────┐
│ client.ts (browser)   │
│ server.ts (server)    │
│ auth.ts (functions)   │
└──────────────────────┘
         ↓
┌─ middleware.ts ──────┐
│ Route protection      │
│ (automatic)           │
└──────────────────────┘
         ↓
┌─ app/login/register──┐
│ Login/Reg pages       │
│ (already connected)   │
└──────────────────────┘
```

---

## ✨ What Works Automatically

After you follow the checklist above:

✅ **Registration**
- User fills form
- Data saved to Supabase
- Redirects to login

✅ **Login**
- Credentials checked against Supabase
- Session created
- Redirects to dashboard

✅ **Logout**
- Session cleared
- Redirects to login

✅ **Route Protection**
- Try accessing `/dashboard` without login
- Automatically redirects to `/login`

✅ **Session Management**
- User stays logged in across page reloads
- Middleware checks automatically

---

## 🚀 Commands You'll Use

```bash
# Start development
npm run dev

# Build for production
npm run build

# Install dependencies
npm install

# TypeScript check
npx tsc --noEmit
```

---

## 📍 Important Locations

| Path | Purpose |
|------|---------|
| `.env.local` | Your credentials |
| `lib/supabase/` | Supabase clients |
| `middleware.ts` | Route protection |
| `app/login/` | Login page |
| `app/register/` | Register page |
| `SUPABASE_QUICKSTART.md` | Quick start guide |

---

## ⚡ Quick Commands

```bash
# After updating .env.local, RESTART dev server:
npm run dev

# Check if build works:
npm run build

# If something breaks:
npm run dev
# (Usually restarts fix it)
```

---

## 🎯 Success Indicators

You're done when:

✅ `npm run dev` starts without errors
✅ Register page loads at `/register`
✅ Can create account with form
✅ New user appears in Supabase Auth
✅ Can login with new account
✅ Redirected to `/dashboard` after login
✅ Logging out redirects to `/login`

---

## 🆘 Help

| Problem | Solution |
|---------|----------|
| "Invalid key" | Restart `npm run dev` |
| "Not found" | Check URL is exactly `NEXT_PUBLIC_SUPABASE_URL` |
| "Connection refused" | Check internet connection |
| "User exists" | Try different email |
| "RLS policy" | Re-run SQL with policies |

**More help**: See `SUPABASE_CONFIG.md`

---

## 🎓 Key Concepts

```
┌─────────────────────────────────┐
│  SUPABASE                        │
│                                  │
│  ┌──────────────────────────┐   │
│  │  Auth Service            │   │
│  │  - Manages users         │   │
│  │  - Sessions              │   │
│  │  - Passwords             │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │  PostgreSQL Database     │   │
│  │  - Stores user profiles  │   │
│  │  - RLS for security      │   │
│  │  - Real-time updates     │   │
│  └──────────────────────────┘   │
│                                  │
└─────────────────────────────────┘
```

**Auth** = Login/Register/Sessions  
**Database** = Store extra user info  
**RLS** = Security (users see only their data)

---

## 💾 Backup Your Keys!

⚠️ **SAVE THESE SOMEWHERE SAFE**:
1. Supabase Project Password
2. SUPABASE_SERVICE_ROLE_KEY
3. SUPABASE_JWT_SECRET (if needed)

**If lost**:
- Can reset keys in Settings → API
- Will break existing sessions
- Only do in development!

---

## 🔐 Don't Ever

❌ Commit `.env.local` to GitHub  
❌ Share `SUPABASE_SERVICE_ROLE_KEY`  
❌ Paste keys in public chat  
❌ Use real passwords as test data  
❌ Disable RLS for convenience  

---

## ✅ Ready to Go?

1. Follow the 🎯 checklist above
2. Read `SUPABASE_QUICKSTART.md`
3. Run `npm run dev`
4. Test at `/register`
5. See it work! 🎉

---

**You got this!** 💪

Everything is set up. Just follow the checklist and you'll have a working Supabase integration in 5 minutes.
