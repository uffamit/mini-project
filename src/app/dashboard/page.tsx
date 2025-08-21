"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck } from "lucide-react";

interface HistoryItem {
  id: string;
  strengthLevel: string;
  feedback: string;
  timestamp: Timestamp;
}

const StrengthBadge = ({ level }: { level: string }) => {
  const levelLower = level.toLowerCase();
  let variant: "default" | "secondary" | "destructive" = "secondary";
  if (levelLower === 'strong') variant = "default";
  if (levelLower === 'weak') variant = "destructive";
  
  return (
    <Badge 
      variant={variant} 
      className={cn(
        "rounded-none", 
        variant === 'default' && "bg-primary text-primary-foreground",
        variant === 'secondary' && "bg-yellow-500 text-black",
        variant === 'destructive' && "bg-destructive text-destructive-foreground",
      )}
    >
      {level}
    </Badge>
  );
};


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setIsHistoryLoading(true);
      const q = query(
        collection(db, "history"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HistoryItem[];
        setHistory(historyData);
        setIsHistoryLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card className="rounded-none border-primary/20 bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <ShieldCheck />
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
      <Card className="rounded-none border-primary/20 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <ShieldCheck />
            <span>Session Logs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isHistoryLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : history.length > 0 ? (
            <div className="border border-primary/20">
            <Table>
              <TableHeader className="bg-primary/10 hover:bg-primary/20">
                <TableRow className="border-primary/20">
                  <TableHead className="w-[200px] text-primary">Timestamp</TableHead>
                  <TableHead className="text-primary">Strength</TableHead>
                  <TableHead className="text-primary">Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id} className="border-primary/20 font-code">
                    <TableCell>{item.timestamp?.toDate().toLocaleString()}</TableCell>
                    <TableCell>
                      <StrengthBadge level={item.strengthLevel} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.feedback}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No analysis history found. Analyze a password on the main page to see logs here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add cn utility function if it's not globally available in your project context.
// In this setup, it's assumed to be in `@/lib/utils`.
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
