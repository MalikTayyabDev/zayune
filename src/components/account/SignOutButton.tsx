"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  return (
    <Button type="button" variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </Button>
  );
}
