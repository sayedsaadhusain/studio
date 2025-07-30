'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id;
    if (!id) return;
    const fetchInvoice = async () => {
      setLoading(true);
      const docRef = doc(db, 'invoices', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setInvoice({ id: docSnap.id, ...docSnap.data() } as Invoice);
      } else {
        console.error('No such document!');
      }
      setLoading(false);
    };

    fetchInvoice();
  }, [params.id]);
  
  const handlePrint = () => {
    window.print();
  }

  if (loading) {
    return <InvoiceSkeleton />;
  }

  if (!invoice) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold">Invoice not found</p>
        <Button asChild variant="link">
          <Link href="/invoices">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back to Invoices
          </Link>
        </Button>
      </div>
    );
  }
  
  const subtotal = invoice.items.reduce((acc, { item, quantity }) => acc + (item.price * quantity), 0);
  const gst = invoice.items.reduce((acc, { item, quantity }) => acc + (item.price * quantity * item.gstPercentage) / 100, 0);

  return (
    <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center print:hidden">
             <Button asChild variant="outline">
                <Link href="/invoices">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
                </Link>
            </Button>
            <Button onClick={handlePrint} className="print:hidden">
                <Printer className="mr-2 h-4 w-4" /> Print Invoice
            </Button>
        </div>
      <Card className="max-w-4xl mx-auto p-4 sm:p-8 printable-area">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">Udhaar Vyapar</h1>
              <p className="text-muted-foreground">123 Business St, Commerce City</p>
            </div>
            <div className="text-left sm:text-right">
              <CardTitle className="text-3xl font-bold mb-2">Invoice</CardTitle>
              <CardDescription>
                <span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}
              </CardDescription>
              <CardDescription>
                <span className="font-semibold">Date:</span> {new Date(invoice.date).toLocaleDateString()}
              </CardDescription>
              {invoice.dueDate && (
                 <CardDescription>
                    <span className="font-semibold">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}
                 </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p className="font-bold">{invoice.party.name}</p>
              <p>{invoice.party.address}</p>
              <p>{invoice.party.phone}</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Item</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map(({ item, quantity }, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">{quantity}</TableCell>
                  <TableCell className="text-right">Rs {item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">Rs {(item.price * quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-6">
            <div className="w-full max-w-xs space-y-2">
               <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>Rs {gst.toFixed(2)}</span>
              </div>
              <Separator />
               <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs {invoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceSkeleton() {
    return (
        <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
             <Skeleton className="h-10 w-40" />
             <Skeleton className="h-10 w-32" />
        </div>
        <Card className="max-w-4xl mx-auto p-4 sm:p-8 w-full">
            <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto mt-4 sm:mt-0">
                    <Skeleton className="h-10 w-32 mb-2" />
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-52 mb-1" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[50%]"><Skeleton className="h-5 w-20" /></TableHead>
                    <TableHead className="text-center"><Skeleton className="h-5 w-20" /></TableHead>
                    <TableHead className="text-right"><Skeleton className="h-5 w-20" /></TableHead>
                    <TableHead className="text-right"><Skeleton className="h-5 w-20" /></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            <div className="flex justify-end mt-6">
                <div className="w-full max-w-xs space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Separator />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
            </CardContent>
        </Card>
        </div>
    )
}
