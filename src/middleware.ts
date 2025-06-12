import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Check session for protected routes
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protected API routes pattern
    const isProtectedApiRoute = req.nextUrl.pathname.startsWith('/api/');
    
    // Authentication check for protected routes
    if (isProtectedApiRoute && !session) {
        return new NextResponse(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Security headers
    const securityHeaders = new Headers(res.headers);
    securityHeaders.set('X-DNS-Prefetch-Control', 'on');
    securityHeaders.set('Strict-Transport-Security', 'max-age=63072000');
    securityHeaders.set('X-Frame-Options', 'SAMEORIGIN');
    securityHeaders.set('X-Content-Type-Options', 'nosniff');
    securityHeaders.set('Referrer-Policy', 'origin-when-cross-origin');
    securityHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Content Security Policy
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://*.irys.xyz https://*.arweave.net;
        connect-src 'self' 
            https://*.supabase.co 
            https://*.irys.xyz
            https://api.story-protocol.xyz
            wss://*.walletconnect.org
            https://*.walletconnect.org;
        frame-ancestors 'none';
        form-action 'self';
    `.replace(/\s+/g, ' ').trim();

    securityHeaders.set('Content-Security-Policy', cspHeader);

    // Apply security headers
    const response = NextResponse.next({
        request: {
            headers: securityHeaders,
        },
    });

    return response;
}