'use client';
import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateInsightsAction } from '@/app/actions';
import { Bot, Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const mockData = {
  salesData: JSON.stringify([
      { "date": "2023-10-01", "item": "Sona Masoori Rice", "quantity": 10, "amount": 600 },
      { "date": "2023-10-02", "item": "Aashirvaad Atta", "quantity": 5, "amount": 1250 },
      { "date": "2023-10-03", "item": "Amul Butter", "quantity": 20, "amount": 5200 }
  ], null, 2),
  inventoryLevels: JSON.stringify([
      { "item": "Sona Masoori Rice", "stock": 50 },
      { "item": "Aashirvaad Atta", "stock": 25 },
      { "item": "Tata Salt", "stock": 100 }
  ], null, 2),
  marketTrends: JSON.stringify({ "seasonal_demand": "High demand for sweets and snacks during festival season (Oct-Nov)." }, null, 2),
  userProfile: JSON.stringify({ "industry": "Grocery", "business_size": "Small", "location": "Bangalore" }, null, 2),
};


export function AIInsights() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [salesData, setSalesData] = useState(mockData.salesData);
  const [inventoryLevels, setInventoryLevels] = useState(mockData.inventoryLevels);
  const [marketTrends, setMarketTrends] = useState(mockData.marketTrends);
  const [userProfile, setUserProfile] = useState(mockData.userProfile);
  const [insight, setInsight] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await generateInsightsAction({
        salesData,
        inventoryLevels,
        marketTrends,
        userProfile,
      });

      if (result.success && result.data) {
        setInsight(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Something went wrong.',
        });
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Business Insights
          </CardTitle>
          <CardDescription className="font-body">
            Get AI-powered recommendations based on your business data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salesData" className="font-headline">Sales Data (JSON)</Label>
            <Textarea id="salesData" value={salesData} onChange={(e) => setSalesData(e.target.value)} rows={4} className="font-code text-xs"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventoryLevels" className="font-headline">Inventory (JSON)</Label>
            <Textarea id="inventoryLevels" value={inventoryLevels} onChange={(e) => setInventoryLevels(e.target.value)} rows={4} className="font-code text-xs"/>
          </div>
          {insight && (
            <Alert className="bg-primary/10 border-primary/50">
              <Lightbulb className="h-4 w-4 !text-primary" />
              <AlertTitle className="font-headline text-primary">Recommendation</AlertTitle>
              <AlertDescription className="font-body text-primary/90">
                {insight}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Get Insights'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
