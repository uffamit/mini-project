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
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  strengthLevel: string;
  feedback: string;
  timestamp: Timestamp;
}

const StrengthBadge = ({ level }: { level: string }) => {
  const levelLower = level.toLowerCase();
  let variant: "default" | "secondary" | "destructive" = "secondary";
  let className = "";

  if (levelLower === 'strong') {
    variant = "default";
    className = "bg-green-500 text-white";
  }
  if (levelLower === 'moderate') {
    variant = "secondary";
     className = "bg-yellow-500 text-black";
  }
  if (levelLower === 'weak') {
    variant = "destructive";
    className = "bg-red-500 text-white";
  }
  
  return (
    <Badge 
      variant={variant} 
      className={cn("font-semibold", className)}
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
          {isHistoryLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : history.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
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
