import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Next.js 16 cookies() returns ReadonlyRequestCookies which doesn't have getAll()
          // We need to manually implement it by getting known cookie names
          const allCookies: Array<{ name: string; value: string }> = [];
          
          // Get the project reference from the Supabase URL
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          if (supabaseUrl) {
            try {
              const url = new URL(supabaseUrl);
              const projectRef = url.hostname.split('.')[0];
              
              // Supabase uses these cookie patterns
              const cookiePatterns = [
                `sb-${projectRef}-auth-token`,
                `sb-${projectRef}-auth-token.0`,
                `sb-${projectRef}-auth-token.1`,
              ];
              
              // Try each pattern
              for (const name of cookiePatterns) {
                try {
                  const cookie = cookieStore.get(name);
                  if (cookie) {
                    allCookies.push({ name: cookie.name, value: cookie.value });
                  }
                } catch (e) {
                  // Cookie doesn't exist, continue
                }
              }
            } catch (e) {
              // URL parsing failed, return empty array
            }
          }
          
          return allCookies;
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};


