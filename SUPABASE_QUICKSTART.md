# 🚀 Supabase Integration - Quick Start Guide

## ✅ Installation Complete!

I've set up Supabase integration for your AuraBeads project. Here's what's been done:

### 📦 Installed Packages
- ✅ `@supabase/supabase-js` - Supabase client library
- ✅ `@supabase/ssr` - Server-side rendering support

### 📁 Created Files
- ✅ `lib/supabase/client.ts` - Browser-side Supabase client
- ✅ `lib/supabase/server.ts` - Server-side Supabase client
- ✅ `lib/supabase/auth.ts` - Authentication functions
- ✅ `middleware.ts` - Session management & route protection
- ✅ `.env.local` - Environment variables template

---

## 🎯 Next Steps (5 minutes)

### Step 1: Get Supabase Credentials (2 min)

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `aurabeads`
   - **Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., us-east-1)
5. Click **"Create new project"** (Wait ~2 minutes)

### Step 2: Copy Your Credentials (2 min)

Once your project is ready:

1. Go to **Settings → API** (left sidebar)
2. Copy these three values:

```
Project URL:
https://your-project-id.supabase.co

Anon Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Service Role Secret (SUPABASE_SERVICE_ROLE_KEY):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Update `.env.local` (1 min)

Edit `h:\Project\Aurabeads\aurabeads\.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 4: Create Database Tables

Go to your Supabase project → **SQL Editor** → Click **"New Query"** → Copy and run:

```sql
-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX users_email_idx ON public.users(email);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🧪 Test Your Setup

### Start Development Server
```bash
npm run dev
```

### Test Registration
1. Go to `http://localhost:3000/register`
2. Fill out the form:
   - Name: `John Doe`
   - Address: `123 Main St`
   - Email: `john@example.com`
   - Password: `TestPassword123!`
3. Click **"Create account"**
4. Check Supabase → **Authentication → Users** to see your registered user

### Test Login
1. Go to `http://localhost:3000/login`
2. Enter your credentials
3. You should be redirected to `/dashboard`

---

## 📋 File Structure

```
components/
├── auth/
│   ├── AuthLayout.tsx
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── PasswordInput.tsx

lib/
├── supabase/
│   ├── client.ts       ← Browser client
│   ├── server.ts       ← Server client
│   └── auth.ts         ← Auth functions
├── auth.ts
├── db.ts
└── validation.ts

app/
├── actions/
│   └── auth.ts         ← Keep for now, or replace with supabase/auth.ts
├── login/
│   └── page.tsx
└── register/
    └── page.tsx

.env.local             ← Your Supabase credentials
middleware.ts          ← Session & route protection
```

---

## 🔄 Two Integration Options

### ❌ OPTION A: Use Only Supabase Auth (Simple)

Use Supabase's built-in authentication (recommended for most apps):

```tsx
// app/actions/auth.ts
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function login(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  
  if (error) return { error: error.message };
  redirect('/dashboard');
}
```

**Pros**: Simple, built-in features (2FA, OAuth, etc.)  
**Cons**: Less control over auth flow

---

### ✅ OPTION B: Hybrid (Current + Supabase) 

Keep your existing Prisma setup but use Supabase PostgreSQL:

1. Get your Supabase database connection string
2. Update Prisma:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Add to `.env.local`:
```env
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

4. Run migrations:
```bash
npx prisma db push
```

**Pros**: Keep familiar workflow, use Supabase PostgreSQL  
**Cons**: More complex setup

---

## 🔐 Security Tips

✅ **DO**:
- Keep `.env.local` private (add to `.gitignore`)
- Use `NEXT_PUBLIC_` only for anon key
- Never commit service role key to git
- Enable Row Level Security on all tables
- Validate inputs on server-side

❌ **DON'T**:
- Expose service role key in browser
- Commit `.env.local` to GitHub
- Skip RLS configuration
- Trust client-side validation alone

---

## 🛠️ Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run Prisma migrations (if using Hybrid option)
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Check TypeScript
npx tsc --noEmit
```

---

## 📚 API Quick Reference

### Supabase Client Functions

```ts
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

// Auth
await supabase.auth.signUp({ email, password });
await supabase.auth.signInWithPassword({ email, password });
await supabase.auth.signOut();
await supabase.auth.getUser();
await supabase.auth.refreshSession();

// Database (uses RLS)
await supabase.from('users').select('*');
await supabase.from('users').insert({ name, email });
await supabase.from('users').update({ name }).eq('id', id);
await supabase.from('users').delete().eq('id', id);

// Real-time subscriptions
supabase
  .channel('users')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'users' }, (payload) => {
    console.log('New user:', payload.new);
  })
  .subscribe();
```

---

## ❓ Troubleshooting

### Problem: "Invalid API Key"
**Solution**: Check `.env.local` has correct keys, restart dev server

### Problem: "Connection refused"
**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` is correct, check internet

### Problem: "User already exists"
**Solution**: Try different email or go to Supabase → Auth → Users to delete test user

### Problem: "PostgreSQL error"
**Solution**: Check your SQL syntax, make sure tables exist

### Problem: "RLS policy denial"
**Solution**: Check RLS policies are set up correctly, or disable temporarily for testing

---

## 🚀 Production Deployment

### Before Deploying:

1. ✅ Update `.env` in production environment
2. ✅ Set up RLS policies on all tables
3. ✅ Run database migrations
4. ✅ Test login/register flow
5. ✅ Set up email verification
6. ✅ Enable 2FA if needed

### Deploy to Vercel:

```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to vercel.com → New Project
# 3. Select your repository
# 4. Add environment variables (same as .env.local)
# 5. Click Deploy
```

---

## 📖 Documentation Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

## ✨ What's Next?

1. **Complete the 4 steps above** ← START HERE
2. **Test registration & login**
3. **Set up dashboard page** to show user info
4. **Add password reset flow**
5. **Implement email verification**
6. **Add OAuth login** (Google, GitHub, etc.)
7. **Deploy to production**

---

**Status**: 🎉 Ready to connect!

You now have everything set up. Just follow the 4 steps above and you'll have a production-ready authentication system powered by Supabase!

**Need help?** Run `npm run dev` and test the login/register pages.
