"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, KeySquare, ShieldCheck } from "lucide-react";

export function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <KeySquare className="h-6 w-6" />
          <span className="hidden sm:inline">PasswordAnalyzer</span>
        </Link>
        <nav className="flex items-center gap-2">
          {!loading && (
            <>
              {user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard">
                      <ShieldCheck />
                      <span className="ml-2 hidden sm:inline">Dashboard</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut}>
                    <LogOut />
                    <span className="ml-2 hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">
                      <User />
                      <span className="ml-2">Login</span>
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
