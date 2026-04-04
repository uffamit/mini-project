"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, KeyRound, Sparkles } from "lucide-react";
import zxcvbn from "zxcvbn";

import { analyzePassword } from "@/ai/flows/analyze-password";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { StrengthMeter } from "@/components/StrengthMeter";

const FormSchema = z.object({
  password: z.string().min(1, "Password cannot be empty."),
});

interface AnalysisResult {
    strengthLevel: 'Weak' | 'Moderate' | 'Strong';
    feedback: string;
    isAiFeedback: boolean;
}

const getPasswordStrength = (password: string): 'Weak' | 'Moderate' | 'Strong' => {
  const result = zxcvbn(password);
  // score: 0, 1, 2, 3, 4 (from weakest to strongest)
  switch (result.score) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
    case 3:
      return 'Moderate';
    case 4:
      return 'Strong';
    default:
      return 'Weak';
  }
};

const getDefaultFeedback = (password: string, strengthLevel: 'Weak' | 'Moderate' | 'Strong'): string => {
  const result = zxcvbn(password);
  const parts: string[] = [];

  if (result.feedback.warning) {
    const warning = result.feedback.warning;
    parts.push(/[.!?]$/.test(warning) ? warning : warning + '.');
  }

  if (result.feedback.suggestions.length > 0) {
    parts.push(...result.feedback.suggestions);
  }

  if (parts.length === 0) {
    if (strengthLevel === 'Strong') {
      return 'Your password is strong. Make sure to store it safely and avoid reusing it on multiple sites.';
    } else if (strengthLevel === 'Moderate') {
      return 'Your password is moderate. Consider adding more characters, mixing uppercase and lowercase letters, numbers, and symbols to improve its strength.';
    } else {
      return 'Your password is weak. Use at least 12 characters and include a mix of uppercase, lowercase, numbers, and special symbols.';
    }
  }

  return parts.join(' ');
};


export function PasswordAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const submissionIdRef = useRef(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setAnalysis(null);

    // Track this specific submission so stale AI responses are ignored
    const currentId = ++submissionIdRef.current;

    // Immediately calculate and display strength using zxcvbn (no AI needed)
    const strengthLevel = getPasswordStrength(data.password);
    const defaultFeedback = getDefaultFeedback(data.password, strengthLevel);

    setAnalysis({
      strengthLevel,
      feedback: defaultFeedback,
      isAiFeedback: false,
    });
    setIsLoading(false);

    // Fetch AI feedback in the background without blocking the UI
    setIsAiLoading(true);
    try {
      const feedbackResult = await analyzePassword({ password: data.password });
      // Only update if this is still the latest submission
      if (currentId === submissionIdRef.current) {
        setAnalysis(prev =>
          prev ? { ...prev, feedback: feedbackResult.feedback, isAiFeedback: true } : null
        );
      }
    } catch (error) {
      // Silently ignore AI errors — the basic result is already shown
      console.error("AI analysis failed (using basic result):", error);
    } finally {
      if (currentId === submissionIdRef.current) {
        setIsAiLoading(false);
      }
    }
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
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                Feedback
                {isAiLoading && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Getting AI feedback...
                  </span>
                )}
                {analysis.isAiFeedback && !isAiLoading && (
                  <span className="flex items-center gap-1 text-xs text-primary ml-2">
                    <Sparkles className="h-3 w-3" />
                    AI
                  </span>
                )}
              </h3>
              <p className="text-sm">{analysis.feedback}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
