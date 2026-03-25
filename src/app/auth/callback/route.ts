import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // 1. THE FIX: Check the browser's cookies for our saved return ticket!
  const cookieStore = await cookies();
  const savedPath = cookieStore.get("returnPath")?.value;
  
  // Use the URL param if it survived, otherwise use the cookie, otherwise dashboard
  const next = searchParams.get('next') ?? savedPath ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); 
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      let response;
      if (isLocalEnv) {
        response = NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        response = NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        response = NextResponse.redirect(`${origin}${next}`);
      }

      // 2. THE CLEANUP: Delete the temporary cookie now that we are done with it
      response.cookies.delete("returnPath");
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}