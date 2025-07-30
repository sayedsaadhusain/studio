'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Invoice, Party, Item } from '@/lib/types';

export function StatsCards() {
  const [stats, setStats] = useState({
    totalSales: 0,
    outstandingAmount: 0,
    newCustomers: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const invoicesSnapshot = await getDocs(collection(db, 'invoices'));
        const invoices = invoicesSnapshot.docs.map(doc => doc.data() as Invoice);
        
        const totalSales = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
        const outstandingAmount = invoices
          .filter(inv => inv.status === 'Due' || inv.status === 'Partial')
          .reduce((acc, inv) => acc + inv.totalAmount, 0);

        const partiesSnapshot = await getDocs(query(collection(db, 'parties'), where('type', '==', 'Customer')));
        const parties = partiesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Party[];
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoTimestamp = Timestamp.fromDate(oneMonthAgo);

        const newCustomersQuery = query(
          collection(db, 'parties'),
          where('type', '==', 'Customer'),
          where('createdAt', '>=', oneMonthAgoTimestamp)
        );
        const newCustomersSnapshot = await getDocs(newCustomersQuery);

        setStats({
          totalSales,
          outstandingAmount,
          newCustomers: newCustomersSnapshot.size,
          totalCustomers: parties.length,
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);
  
  const statsData = [
    {
      title: 'Total Sales',
      value: `Rs ${stats.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: 'All-time sales revenue',
    },
    {
      title: 'Outstanding Amount',
      value: `Rs ${stats.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: IndianRupee,
      description: 'Total amount due from customers',
    },
    {
      title: 'New Customers',
      value: `+${stats.newCustomers}`,
      icon: TrendingUp,
      description: 'In the last 30 days',
    },
    {
      title: 'Total Customers',
      value: `${stats.totalCustomers}`,
      icon: Users,
      description: 'Total number of customers',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardContent>
            </Card>
        ))}
      </div>
    );
  }


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
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
