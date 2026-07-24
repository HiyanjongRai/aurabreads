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

/**
 * SUPABASE VERSION - Register user
 * Stores user in Supabase Auth + custom users table
 */
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

  try {
    const supabase = await createSupabaseServerClient();

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          address,
        },
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return {
          fields: { name, address, email },
          fieldErrors: { email: ['An account with this email already exists.'] },
          error: 'Please use a different email address.',
        };
      }
      return {
        fields: { name, address, email },
        error: authError.message || 'Failed to create account.',
      };
    }

    if (!authData.user) {
      return {
        fields: { name, address, email },
        error: 'Failed to create user account. Please try again.',
      };
    }

    redirect('/login?registered=1');
  } catch (err) {
    console.error('Registration error:', err);
    return {
      fields: { name, address, email },
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * SUPABASE VERSION - Login user
 * Authenticates with Supabase Auth
 */
export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getString(formData, 'email');
  const password = getString(formData, 'password');

  const parsed = loginSchema.safeParse({
    email,
    password,
  });

  if (!parsed.success) {
    return {
      fields: { email },
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: 'Please fix the highlighted fields.',
    };
  }

  try {
    const supabase = await createSupabaseServerClient();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      console.error('Login error:', error);
      return {
        fields: { email: parsed.data.email },
        error: 'Invalid email or password.',
      };
    }

    if (!data.user) {
      return {
        fields: { email: parsed.data.email },
        error: 'Failed to sign in. Please try again.',
      };
    }

    redirect('/dashboard');
  } catch (err) {
    console.error('Unexpected login error:', err);
    return {
      fields: { email },
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * SUPABASE VERSION - Logout user
 * Signs out from Supabase Auth
 */
export async function logout() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Logout error:', err);
  }
  redirect('/login');
}

/**
 * Get current user from Supabase
 * Use this in your layout or components to check authentication
 */
export async function getCurrentUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('Get user error:', err);
    return null;
  }
}

/**
 * Get user profile from custom users table
 * Requires users table setup in Supabase
 */
export async function getUserProfile(userId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get profile error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Profile fetch error:', err);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Record<string, any>) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Update error:', error);
      return { error: error.message };
    }

    return { data };
  } catch (err) {
    console.error('Unexpected update error:', err);
    return { error: 'An unexpected error occurred.' };
  }
}
