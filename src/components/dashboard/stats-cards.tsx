import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, IndianRupee, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: 'Total Sales',
    value: '₹1,25,430.50',
    icon: DollarSign,
    description: '+20.1% from last month',
  },
  {
    title: 'Outstanding Amount',
    value: '₹22,150.00',
    icon: IndianRupee,
    description: 'Across 12 invoices',
  },
  {
    title: 'New Customers',
    value: '+12',
    icon: TrendingUp,
    description: 'This month',
  },
  {
    title: 'Stock Value',
    value: '₹89,700.00',
    icon: TrendingUp,
    description: 'Across 58 items',
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-body text-2xl font-bold">{stat.value}</div>
            <p className="font-body text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
