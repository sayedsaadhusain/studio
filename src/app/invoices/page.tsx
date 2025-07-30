'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Invoice } from '@/lib/types';


export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const invoicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invoice[];
      setInvoices(invoicesData);
    };
    fetchInvoices();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Invoices"
        action={
          <Button asChild>
            <Link href="/invoices/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.party.name}</TableCell>
                    <TableCell>
                      {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>Rs {invoice.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'font-semibold text-white',
                          invoice.status === 'Paid' &&
                            'border-green-600 bg-green-500 hover:bg-green-600',
                          invoice.status === 'Due' &&
                            'border-red-600 bg-red-500 hover:bg-red-600',
                          invoice.status === 'Partial' &&
                            'border-yellow-600 bg-yellow-500 hover:bg-yellow-600'
                        )}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Record Payment</DropdownMenuItem>
                          <DropdownMenuItem>Share Payment Link</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
