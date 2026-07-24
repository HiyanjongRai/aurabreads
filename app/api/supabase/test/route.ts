import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error, status } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Supabase connection test failed.',
          status,
          error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase is connected successfully.',
      dataCount: data?.length ?? 0,
      sample: data?.[0] ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unexpected error while testing Supabase connection.',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
