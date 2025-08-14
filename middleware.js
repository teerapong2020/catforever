import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/","/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const jwt = await jwtVerify(token, secret);


    if (pathname.startsWith("/catfeedback") && !jwt) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/catfeedback/:path*"], 
};
