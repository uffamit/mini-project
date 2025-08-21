"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="text-primary" />
                  <span>Session Logs</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            <span>Session Logs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground">Session history is not available with dummy authentication. Analyze a password on the main page to see live results.</p>
        </CardContent>
      </Card>
    </div>
  );
}
