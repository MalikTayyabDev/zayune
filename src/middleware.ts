import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && !path.startsWith("/admin/login") && role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (
      (path === "/account" ||
        path.startsWith("/account/orders") ||
        path.startsWith("/account/wishlist")) &&
      role !== "customer" &&
      role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/account/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin/login")) return true;
        if (path.startsWith("/account/login") || path.startsWith("/account/register")) {
          return true;
        }
        if (path.startsWith("/admin")) return !!token;
        if (
          path === "/account" ||
          path.startsWith("/account/orders") ||
          path.startsWith("/account/wishlist")
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/account",
    "/account/orders/:path*",
    "/account/wishlist",
  ],
};
