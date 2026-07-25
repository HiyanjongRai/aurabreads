'use server';

import { requireRole } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { createClient } from '@supabase/supabase-js';
import { logAuthEvent } from '@/lib/audit-log';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createSellerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  storeName: z.string().trim().min(2, 'Store name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  address: z.string().trim().min(3, 'Address must be at least 3 characters'),
  autoConfirm: z.boolean().default(true),
});

export type CreateSellerState = {
  fields?: {
    name?: string;
    storeName?: string;
    email?: string;
    password?: string;
    address?: string;
  };
  fieldErrors?: Record<string, string[] | undefined>;
  error?: string;
  success?: boolean;
  message?: string;
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twyrkcgwpiyeftrdlumi.supabase.co';
  const secretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    '';
  return createClient(url, secretKey, {
    global: {
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
      },
    },
    auth: { persistSession: false },
  });
}

export async function bulkDeleteUsersAction(userIds: string[]) {
  const adminUser = await requireRole('ADMIN');
  const ids = Array.from(new Set((userIds || []).filter(Boolean)));

  if (ids.length === 0) {
    return { success: false, message: 'No users were selected.' };
  }

  try {
    const db = getDb();
    const existingUsers = await db.user.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    const deletableIds = existingUsers.map((user) => user.id).filter((id) => id !== adminUser.id);
    if (deletableIds.length === 0) {
      return { success: false, message: 'No deletable users were selected.' };
    }

    await db.user.deleteMany({ where: { id: { in: deletableIds } } });

    try {
      const supabaseAdmin = getSupabaseAdmin();
      for (const userId of deletableIds) {
        await supabaseAdmin.auth.admin.deleteUser(userId);
      }
    } catch (supabaseErr) {
      console.warn('[ADMIN BULK DELETE USERS SUPABASE WARN]', supabaseErr);
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin');

    return { success: true, message: `Deleted ${deletableIds.length} user(s).` };
  } catch (err) {
    console.error('[ADMIN BULK DELETE USERS ERROR]', err);
    return { success: false, message: 'Failed to delete selected users.' };
  }
}

export async function createSellerAction(
  _prevState: CreateSellerState,
  formData: FormData
): Promise<CreateSellerState> {
  // 1. Guard — caller MUST be an ADMIN
  const adminUser = await requireRole('ADMIN');
  
  const reqHeaders = await headers();
  const ip = reqHeaders.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

  const rawFields = {
    name: (formData.get('name') as string) || '',
    storeName: (formData.get('storeName') as string) || '',
    email: (formData.get('email') as string) || '',
    password: (formData.get('password') as string) || '',
    address: (formData.get('address') as string) || '',
    autoConfirm: formData.get('autoConfirm') === 'on' || formData.get('autoConfirm') === 'true',
  };

  const parsed = createSellerSchema.safeParse(rawFields);
  if (!parsed.success) {
    return {
      fields: rawFields,
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: 'Please fix the highlighted errors below.',
    };
  }

  const { name, storeName, email, password, address, autoConfirm } = parsed.data;

  // 2. Create in Supabase Auth with SELLER role
  let supabaseUserId = '';
  try {
    const admin = getSupabaseAdmin();
    const { data: userData, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: autoConfirm,
      user_metadata: { name, address, storeName },
      app_metadata: { role: 'SELLER' },
    });

    if (createError) {
      console.warn('[ADMIN CREATE SELLER SUPABASE WARN]', createError.message);
      if (createError.message.includes('already been registered') || createError.message.includes('already exists')) {
        return {
          fields: rawFields,
          error: `An account with email ${email} already exists.`,
        };
      }
      return {
        fields: rawFields,
        error: createError.message,
      };
    }

    if (userData.user) {
      supabaseUserId = userData.user.id;
    }
  } catch (err) {
    console.error('[ADMIN CREATE SELLER SUPABASE EXCEPTION]', err);
    return {
      fields: rawFields,
      error: 'Failed to create seller in auth provider.',
    };
  }

  // 3. Sync to Prisma Database as SELLER
  try {
    const db = getDb();
    const passwordHash = await hashPassword(password);

    await db.user.upsert({
      where: { email },
      update: {
        role: 'SELLER' as any,
        name: `${name} (${storeName})`,
        address,
        isVerified: true,
      },
      create: {
        id: supabaseUserId || undefined,
        name: `${name} (${storeName})`,
        address,
        email,
        passwordHash,
        role: 'SELLER' as any,
        isVerified: true,
      },
    });

    await logAuthEvent({
      action: 'REGISTER_SUCCESS',
      email,
      ip,
      success: true,
      userId: adminUser.id,
      reason: `Created seller: ${storeName} (${email})`,
    });
  } catch (dbErr) {
    console.error('[ADMIN CREATE SELLER PRISMA ERROR]', dbErr);
  }

  redirect('/admin/users/sellers');
}
