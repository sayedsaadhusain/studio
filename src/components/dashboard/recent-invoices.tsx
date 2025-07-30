'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Invoice } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export function RecentInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentInvoices = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'invoices'), orderBy('date', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        const invoicesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Invoice[];
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Error fetching recent invoices:", error);
      }
      setLoading(false);
    };

    fetchRecentInvoices();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Invoices</CardTitle>
        <CardDescription className="font-body">A list of your 5 most recent invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    </TableRow>
                ))
            ) : invoices.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        No recent invoices found.
                    </TableCell>
                </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.party.name}</TableCell>
                  <TableCell>₹{invoice.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'font-semibold text-white',
                        invoice.status === 'Paid' && 'border-green-600 bg-green-500 hover:bg-green-600',
                        invoice.status === 'Due' && 'border-red-600 bg-red-500 hover:bg-red-600',
                        invoice.status === 'Partial' && 'border-yellow-600 bg-yellow-500 hover:bg-yellow-600'
                      )}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
