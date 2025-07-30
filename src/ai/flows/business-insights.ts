// Business insights flow
'use server';

/**
 * @fileOverview An AI agent that provides business insights based on sales data, inventory,
 * and market trends.
 *
 * - getBusinessInsights - A function that generates business insights.
 * - BusinessInsightsInput - The input type for the getBusinessInsights function.
 * - BusinessInsightsOutput - The return type for the getBusinessInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessInsightsInputSchema = z.object({
  salesData: z.string().describe('Sales data in JSON format.'),
  inventoryLevels: z.string().describe('Inventory levels in JSON format.'),
  marketTrends: z.string().describe('Market trends in JSON format.'),
  userProfile: z.string().describe('User profile data in JSON format, including industry, business size, and location.'),
});
export type BusinessInsightsInput = z.infer<typeof BusinessInsightsInputSchema>;

const BusinessInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-driven insights and recommendations for the business.'),
});
export type BusinessInsightsOutput = z.infer<typeof BusinessInsightsOutputSchema>;

export async function getBusinessInsights(input: BusinessInsightsInput): Promise<BusinessInsightsOutput> {
  return businessInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'businessInsightsPrompt',
  input: {schema: BusinessInsightsInputSchema},
  output: {schema: BusinessInsightsOutputSchema},
  prompt: `You are a business consultant providing actionable advice to small business owners in India.

  Analyze the following business data and provide specific, practical recommendations to optimize their operations and increase profitability. Consider the user's profile when providing recommendations.

  Sales Data: {{{salesData}}}
  Inventory Levels: {{{inventoryLevels}}}
  Market Trends: {{{marketTrends}}}
  User Profile: {{{userProfile}}}

  Focus on providing insights related to:
  - Sales optimization
  - Inventory management
  - Market opportunities
  - Cost reduction
  - Customer engagement

  Format your response as a concise paragraph with clear and actionable recommendations.
  `,
});

const businessInsightsFlow = ai.defineFlow(
  {
    name: 'businessInsightsFlow',
    inputSchema: BusinessInsightsInputSchema,
    outputSchema: BusinessInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
