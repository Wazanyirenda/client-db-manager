import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const cookieStore = await cookies();

  // Create a regular client to verify the user is authenticated
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies: Array<{ name: string; value: string }> = [];
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          if (supabaseUrl) {
            try {
              const url = new URL(supabaseUrl);
              const projectRef = url.hostname.split('.')[0];
              const cookiePatterns = [
                `sb-${projectRef}-auth-token`,
                `sb-${projectRef}-auth-token.0`,
                `sb-${projectRef}-auth-token.1`,
              ];
              for (const name of cookiePatterns) {
                try {
                  const cookie = cookieStore.get(name);
                  if (cookie) {
                    allCookies.push({ name: cookie.name, value: cookie.value });
                  }
                } catch {
                  // Cookie doesn't exist
                }
              }
            } catch {
              // URL parsing failed
            }
          }
          return allCookies;
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore errors
          }
        },
      },
    }
  );

  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Delete user data using the regular client (RLS policies apply)
  const { error: clientsError } = await supabase
    .from('clients')
    .delete()
    .eq('user_id', user.id);

  if (clientsError) {
    console.error('Error deleting clients:', clientsError);
  }

  // Delete tasks
  const { error: tasksError } = await supabase
    .from('tasks')
    .delete()
    .eq('user_id', user.id);

  if (tasksError) {
    console.error('Error deleting tasks:', tasksError);
  }

  // Delete notifications
  const { error: notificationsError } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', user.id);

  if (notificationsError) {
    console.error('Error deleting notifications:', notificationsError);
  }

  // Delete profile
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id);

  if (profileError) {
    console.error('Error deleting profile:', profileError);
  }

  // Delete the auth user using the admin client (requires service role key)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    // Sign out the user even if we can't delete the auth record
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: 'Service role key not configured. User data deleted but auth account remains. Contact support.' },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error('Error deleting auth user:', deleteError);
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: 'Failed to delete auth account. Data was removed. Contact support.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
