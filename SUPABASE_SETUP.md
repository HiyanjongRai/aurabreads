# Supabase Integration Guide for AuraBeads

## 📋 Quick Setup Steps

### 1. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing one
3. Go to **Settings → API**
4. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Update `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Install Dependencies

```bash
npm install
```

This adds:
- `@supabase/supabase-js` - Client library
- `@supabase/ssr` - Server-side rendering support

---

## 🗄️ Set Up Database Tables

### Create Users Table in Supabase

Go to **SQL Editor** in Supabase and run:

```sql
-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX users_email_idx ON public.users(email);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Create policy: Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🔌 Using Supabase Clients

### Client-Side (Browser)

```tsx
// lib/supabase/client.ts - Already created
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      name: 'John Doe',
      address: '123 Main St',
    }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### Server-Side (Node.js)

```ts
// lib/supabase/server.ts - Already created
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server';

// Regular server client (respects RLS)
const supabase = await createSupabaseServerClient();

// Admin client (bypasses RLS - use carefully!)
const admin = await createSupabaseAdminClient();
```

---

## 🔐 Integrate with Your Auth Form

### Option A: Use Supabase Auth (Recommended)

Replace your current authentication with Supabase Auth:

```ts
// app/actions/auth.ts - Updated for Supabase
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { loginSchema, registerSchema } from '@/lib/validation';
import { redirect } from 'next/navigation';

export type AuthFormState = {
  success?: string;
  error?: string;
  fields?: Record<string, string>;
  fieldErrors?: Record<string, string[] | undefined>;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function register(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fields = {
    name: getString(formData, 'name'),
    address: getString(formData, 'address'),
    email: getString(formData, 'email'),
  };

  const parsed = registerSchema.safeParse({
    ...fields,
    password: getString(formData, 'password'),
  });

  if (!parsed.success) {
    return {
      fields,
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: 'Please fix the highlighted fields.',
    };
  }

  const { name, address, email, password } = parsed.data;
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          address,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return {
          fields: { name, address, email },
          fieldErrors: { email: ['An account with this email already exists.'] },
          error: 'Please use a different email address.',
        };
      }
      return {
        fields: { name, address, email },
        error: error.message || 'Failed to create account.',
      };
    }

    // Optionally verify email before redirecting
    redirect('/login?registered=1');
  } catch (err) {
    return {
      fields: { name, address, email },
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getString(formData, 'email');
  const parsed = loginSchema.safeParse({
    email,
    password: getString(formData, 'password'),
  });

  if (!parsed.success) {
    return {
      fields: { email },
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: 'Please fix the highlighted fields.',
    };
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return {
        fields: { email: parsed.data.email },
        error: 'Invalid email or password.',
      };
    }

    redirect('/dashboard');
  } catch (err) {
    return {
      fields: { email: parsed.data.email },
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
```

### Option B: Keep Prisma, Store Data in Supabase

If you want to keep your current Prisma setup but store data in Supabase:

```ts
// Update your Prisma schema to use Supabase PostgreSQL
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add to .env.local:
// DATABASE_URL=postgresql://user:password@db.your-project.supabase.co:5432/postgres
```

---

## 🔄 Middleware for Session Management

Create `middleware.ts` in project root:

```ts
import { type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (data.user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/login', '/register', '/dashboard', '/dashboard/:path*'],
};
```

---

## 📊 Query Examples

### Get Current User

```ts
const supabase = await createSupabaseServerClient();
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  console.log('Logged in as:', user.email);
}
```

### Query User Profile

```ts
const supabase = await createSupabaseServerClient();

const { data: profile, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single();
```

### Update User Profile

```ts
const { data, error } = await supabase
  .from('users')
  .update({ name: 'New Name' })
  .eq('id', user.id)
  .select();
```

### Delete User

```ts
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', user.id);
```

---

## 🔒 Security Best Practices

1. **Never expose service role key** in client-side code
2. **Enable Row Level Security (RLS)** on all tables
3. **Use environment variables** for all secrets
4. **Validate inputs** on both client and server
5. **Hash passwords** before storing (Supabase Auth does this)
6. **Use HTTPS only** in production
7. **Set up CORS** if using from different domains

---

## 🐛 Troubleshooting

### "Invalid API Key"
- Check your `.env.local` has correct keys
- Verify keys match your Supabase project
- Restart dev server after updating `.env.local`

### "Connection refused"
- Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- Check internet connection
- Verify Supabase project is active

### "User already exists"
- Email is already registered
- Try different email or use forgot password

### "Authentication required"
- User session expired
- Need to login again
- Check cookies are enabled

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [PostgreSQL with Supabase](https://supabase.com/docs/guides/database)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## ✅ Next Steps

1. **Create Supabase account** and project
2. **Copy credentials** to `.env.local`
3. **Run** `npm install`
4. **Create tables** using SQL above
5. **Update auth.ts** with Supabase functions
6. **Test registration** and login
7. **Deploy** to production

---

**Need Help?** Check the Supabase docs or run:
```bash
npm run dev
```
