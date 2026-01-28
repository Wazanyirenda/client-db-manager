import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = cookies();
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
                  } catch (e) {
                    // Cookie doesn't exist
                  }
                }
              } catch (e) {
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
            } catch (error) {
              // Ignore errors in server component
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate with Google`);
}

