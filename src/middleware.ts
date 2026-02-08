import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    const isLoginPage = request.nextUrl.pathname.startsWith("/login");
    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname === "/";

    // Public assets
    if (
        request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.startsWith("/api") ||
        request.nextUrl.pathname.includes(".") // static files
    ) {
        return NextResponse.next();
    }

    // Decrypt session
    const payload = session ? await decrypt(session) : null;

    // 1. If trying to access dashboard/root without valid session -> redirect to login
    if (isDashboard && !payload) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. If logged in and trying to access login -> redirect to dashboard
    if (isLoginPage && payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 3. If accessing root with session -> redirect to dashboard
    if (request.nextUrl.pathname === "/" && payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
