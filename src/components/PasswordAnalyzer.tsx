"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Terminal } from "lucide-react";

import { analyzePassword, AnalyzePasswordOutput } from "@/ai/flows/analyze-password";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { StrengthMeter } from "@/components/StrengthMeter";
import { useToast } from "@/hooks/use-toast";
import { TypingEffect } from "./TypingEffect";

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
      <Card className="rounded-none border-primary/20 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Terminal />
            <span>Password Strength Analyzer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-primary">$ &gt;</span>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          className="w-full rounded-none border-2 border-primary/30 bg-transparent pl-12 font-code text-lg text-foreground transition-all focus:border-primary focus:shadow-glow focus-visible:ring-0"
                          placeholder="Enter password to analyze..."
                          {...field}
                        />
                      </FormControl>
                      <span className="pointer-events-none absolute inset-y-0 right-3 hidden items-center group-focus-within:flex">
                        <span className="h-2/3 w-0.5 animate-pulse bg-primary blinking-cursor border-primary"></span>
                      </span>
                    </div>
                    <FormMessage className="text-accent"/>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full rounded-none border-2 border-primary bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow disabled:opacity-50">
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
        <Card className="rounded-none border-primary/20 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-accent">
                <TypingEffect text="Analysis Result"/>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Strength Level: {analysis.strengthLevel}</h3>
              <StrengthMeter strengthLevel={analysis.strengthLevel} />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Feedback</h3>
              <p className="font-code text-muted-foreground">{analysis.feedback}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
