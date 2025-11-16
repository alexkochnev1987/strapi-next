import { NextRequest, NextResponse } from 'next/server';

import { STRAPI_URL } from '@/lib/config';

/**
 * GET /api/auth/callback - Handle OAuth callback from Strapi
 * Processes tokens from URL parameters and sets authentication cookie
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Check for error parameter
    const errorParam = searchParams.get('error');
    if (errorParam) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorParam)}`, request.url)
      );
    }
    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
      return NextResponse.redirect(
        new URL('/login?error=missing_token', request.url)
      );
    }

    const strapiRes = await fetch(
      `${STRAPI_URL}/api/auth/google/callback?access_token=${encodeURIComponent(accessToken)}`
    );

    const data = await strapiRes.json();

    const { jwt, user } = data;
    if (!strapiRes.ok) {
      return NextResponse.redirect(
        new URL('/login?error=strapi_auth_failed', request.url)
      );
    }
    // Create redirect response to home page
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));

    // Set HttpOnly cookie with JWT (same format as login/register)
    redirectResponse.cookies.set({
      name: 'sid',
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return redirectResponse;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=callback_failed', request.url)
    );
  }
}
