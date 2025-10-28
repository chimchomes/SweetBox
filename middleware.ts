import { NextResponse } from 'next/server';

// Simple optional gate for production preview.
// Right now it just allows everything. You can extend later to require a header/token.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
