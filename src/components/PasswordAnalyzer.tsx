"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, KeyRound } from "lucide-react";

import { analyzePassword, AnalyzePasswordOutput } from "@/ai/flows/analyze-password";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { StrengthMeter } from "@/components/StrengthMeter";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  password: z.string().min(1, "Password cannot be empty."),
});

export function PasswordAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzePasswordOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  });

  const saveHistory = async (result: AnalyzePasswordOutput) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "history"), {
        userId: user.uid,
        ...result,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving history:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save check to session logs.",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzePassword({ password: data.password });
      setAnalysis(result);
      if (user) {
        await saveHistory(result);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="text-primary"/>
            <span>Password Strength Analyzer</span>
          </CardTitle>
          <CardDescription>Enter a password below to analyze its strength and get feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password to analyze..."
                        {...field}
                        className="rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full rounded-md">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Strength Level</h3>
              <StrengthMeter strengthLevel={analysis.strengthLevel} />
              <p className="mt-2 font-semibold">{analysis.strengthLevel}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Feedback</h3>
              <p className="text-sm">{analysis.feedback}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
