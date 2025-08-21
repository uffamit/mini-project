'use server';

/**
 * @fileOverview Analyzes password strength and provides feedback.
 *
 * - analyzePassword - A function that analyzes the password.
 * - AnalyzePasswordInput - The input type for the analyzePassword function.
 * - AnalyzePasswordOutput - The return type for the analyzePassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePasswordInputSchema = z.object({
  password: z.string().describe('The password to analyze.'),
});
export type AnalyzePasswordInput = z.infer<typeof AnalyzePasswordInputSchema>;

const AnalyzePasswordOutputSchema = z.object({
  feedback: z.string().describe('Feedback on how to improve the password.'),
});
export type AnalyzePasswordOutput = z.infer<typeof AnalyzePasswordOutputSchema>;

export async function analyzePassword(
  input: AnalyzePasswordInput
): Promise<AnalyzePasswordOutput> {
  return analyzePasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePasswordPrompt',
  input: {schema: AnalyzePasswordInputSchema},
  output: {schema: AnalyzePasswordOutputSchema},
  prompt: `You are a security expert. Based on the password provided, provide actionable and specific feedback on how to improve it.
Consider common password security rules like length, character types (uppercase, lowercase, numbers, symbols), and avoiding common patterns.

Password: {{{password}}}

Respond in JSON format with a single "feedback" field.
`,
});

const analyzePasswordFlow = ai.defineFlow(
  {
    name: 'analyzePasswordFlow',
    inputSchema: AnalyzePasswordInputSchema,
    outputSchema: AnalyzePasswordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
