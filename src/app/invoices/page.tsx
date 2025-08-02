'use client';
import { PlusCircle, MoreHorizontal, Copy, Trash2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Invoice } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    const querySnapshot = await getDocs(collection(db, "invoices"));
    const invoicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invoice[];
    setInvoices(invoicesData);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleShareLink = (invoiceId: string) => {
    const url = `${window.location.origin}/invoices/${invoiceId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Invoice link has been copied to your clipboard.",
    });
  };

  const openPaymentDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.totalAmount);
    setIsPaymentDialogOpen(true);
  }

  const handleRecordPayment = async () => {
    if (!selectedInvoice || paymentAmount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid amount' });
      return;
    }
    
    const invoiceRef = doc(db, "invoices", selectedInvoice.id);
    const newTotal = selectedInvoice.totalAmount - paymentAmount;
    let newStatus: 'Paid' | 'Due' | 'Partial' = 'Partial';

    if (newTotal <= 0) {
        newStatus = 'Paid';
    } else {
        newStatus = 'Partial';
    }

    try {
        await updateDoc(invoiceRef, { 
            totalAmount: newTotal,
            status: newStatus 
        });
        toast({ title: "Payment Recorded", description: `Rs ${paymentAmount} payment recorded for ${selectedInvoice.invoiceNumber}`});
        setIsPaymentDialogOpen(false);
        setSelectedInvoice(null);
        fetchInvoices(); // Refresh invoices
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error recording payment' });
        console.error(e);
    }
  }

  const openDeleteDialog = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    try {
        await deleteDoc(doc(db, "invoices", invoiceToDelete.id));
        toast({ title: "Invoice Deleted", description: `Invoice ${invoiceToDelete.invoiceNumber} has been deleted.` });
        fetchInvoices(); // Refresh the list
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error deleting invoice' });
        console.error("Error deleting document: ", e);
    } finally {
        setIsDeleteDialogOpen(false);
        setInvoiceToDelete(null);
    }
  }


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
                      <Link href={`/invoices/${invoice.id}`} className="hover:underline text-primary">
                        {invoice.invoiceNumber}
                      </Link>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/invoices/${invoice.id}`}>View Invoice</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openPaymentDialog(invoice)}>Record Payment</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareLink(invoice.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Share Payment Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(invoice)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                          </DropdownMenuItem>
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

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Record Payment for {selectedInvoice?.invoiceNumber}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <p>Total amount due: Rs {selectedInvoice?.totalAmount.toFixed(2)}</p>
                <div>
                    <Label htmlFor="paymentAmount">Payment Amount</Label>
                    <Input 
                        id="paymentAmount"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleRecordPayment}>Save Payment</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete the invoice {invoiceToDelete?.invoiceNumber}. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteInvoice} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
