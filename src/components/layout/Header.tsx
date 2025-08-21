"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { LogOut, User, KeySquare, ShieldCheck } from "lucide-react";
import { TypingEffect } from "@/components/TypingEffect";

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="border-b border-primary/20 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary transition-shadow hover:shadow-glow">
          <KeySquare className="h-6 w-6" />
          <div className="hidden sm:block">
            <TypingEffect text="PasswordAnalyzer" />
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          {!loading && (
            <>
              {user ? (
                <>
                  <Button variant="ghost" className="rounded-none hover:bg-primary/10 hover:text-primary" asChild>
                    <Link href="/dashboard">
                      <ShieldCheck />
                      <span className="ml-2 hidden sm:inline">Session Logs</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut} className="rounded-none hover:bg-accent/10 hover:text-accent">
                    <LogOut />
                    <span className="ml-2 hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="rounded-none hover:bg-primary/10 hover:text-primary" asChild>
                    <Link href="/login">
                      <User />
                      <span className="ml-2">Login</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-glow" asChild>
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
