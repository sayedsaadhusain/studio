'use server';

import {
  getBusinessInsights,
  type BusinessInsightsInput,
} from '@/ai/flows/business-insights';
import { z } from 'zod';

const businessInsightsInputSchema = z.object({
  salesData: z.string(),
  inventoryLevels: z.string(),
  marketTrends: z.string(),
  userProfile: z.string(),
});

export async function generateInsightsAction(
  input: BusinessInsightsInput
): Promise<{ success: boolean; data?: string; error?: string }> {
  const parsed = businessInsightsInputSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const result = await getBusinessInsights(parsed.data);
    return { success: true, data: result.insights };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate insights.' };
  }
}
