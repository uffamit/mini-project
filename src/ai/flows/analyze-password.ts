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
  strengthLevel: z
    .string()
    .describe(
      'The strength level of the password (e.g., Weak, Moderate, Strong).'
    ),
  feedback: z.string().describe('Feedback on how to improve the password.'),
});
export type AnalyzePasswordOutput = z.infer<typeof AnalyzePasswordOutputSchema>;

export async function analyzePassword(input: AnalyzePasswordInput): Promise<AnalyzePasswordOutput> {
  return analyzePasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePasswordPrompt',
  input: {schema: AnalyzePasswordInputSchema},
  output: {schema: AnalyzePasswordOutputSchema},
  prompt: `You are a security expert analyzing password strength. Evaluate the password provided and provide a strength level (Weak, Moderate, Strong) and feedback on how to improve it.  Consider rules for password security and length.

Password: {{{password}}}

Respond in JSON format with strengthLevel and feedback fields.  The feedback should be actionable and specific.
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
