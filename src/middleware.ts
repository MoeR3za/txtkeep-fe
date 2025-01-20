import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import backendAPI from "@/app/api/util/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token");
    const { pathname } = request.nextUrl;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    
    try {
        const response = await backendAPI.post('auth/token/verify', { token: token.value });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return NextResponse.redirect(new URL('/login', request.url));
        }
        
        if (!pathname.includes("/dashboard")) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Apply Middleware to Protected Routes
export const config = {
    matcher: ["/dashboard/:path*", "/"], // Protect dashboard and all subroutes
};
