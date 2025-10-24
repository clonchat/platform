import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Check if it's a subdomain (not www or main domain)
  const isSubdomain =
    hostname.includes(".clonchat.com") &&
    !hostname.startsWith("www.") &&
    hostname !== "clonchat.com";

  if (isSubdomain) {
    // Extract subdomain
    const subdomain = hostname.split(".")[0];

    // Rewrite to chatbot page with subdomain as param
    return NextResponse.rewrite(
      new URL(`/chatbot?subdomain=${subdomain}`, request.url)
    );
  }

  // Auth and onboarding protection logic
  const token = await getToken({ req: request });

  // If user is not authenticated
  if (!token) {
    // If trying to access protected routes, redirect to login
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next(); // Allow access to public pages
  }

  // If user IS authenticated, check their status
  try {
    // Make internal API call to check user status
    const apiUrl = new URL("/user/status", request.url);
    apiUrl.hostname = "localhost";
    apiUrl.port = "3001";

    const res = await fetch(apiUrl.toString(), {
      headers: {
        "X-User-Id": token.sub || "",
        "X-User-Email": token.email || "",
      },
    });

    if (!res.ok) {
      console.error("Error checking user status in middleware:", res.status);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { hasCompletedOnboarding, emailVerified } = await res.json();

    // Redirect logic based on status
    if (!emailVerified) {
      // If email not verified and not on verification pages, redirect to verify-email
      if (!pathname.startsWith("/verify-email") && pathname !== "/login") {
        return NextResponse.redirect(new URL("/verify-email", request.url));
      }
    } else if (!hasCompletedOnboarding) {
      // If email verified but onboarding not completed
      if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    } else {
      // If onboarding completed and trying to access onboarding, redirect to dashboard
      if (pathname.startsWith("/onboarding")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  } catch (error) {
    console.error("Error checking user status in middleware:", error);
    // In case of error, redirect to login for safety
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
