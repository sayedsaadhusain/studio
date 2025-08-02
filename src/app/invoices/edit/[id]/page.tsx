'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PlusCircle, Trash2 } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Party, Item, InvoiceItem, Invoice } from '@/lib/types';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  const [partyId, setPartyId] = useState<string | undefined>();
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>();
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartiesAndItems = async () => {
      const partiesSnapshot = await getDocs(collection(db, "parties"));
      const partiesData = partiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Party[];
      setParties(partiesData);

      const itemsSnapshot = await getDocs(collection(db, "items"));
      const itemsData = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];
      setItems(itemsData);
    };

    const fetchInvoice = async () => {
      if (!id) return;
      setLoading(true);
      const docRef = doc(db, 'invoices', id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const invoiceData = { id: docSnap.id, ...docSnap.data() } as Invoice;
        setInvoice(invoiceData);
        setPartyId(invoiceData.partyId);
        setInvoiceDate(new Date(invoiceData.date));
        if (invoiceData.dueDate) {
          setDueDate(new Date(invoiceData.dueDate));
        }
        setInvoiceItems(invoiceData.items);
      } else {
        console.error('No such document!');
        toast({ variant: 'destructive', title: 'Invoice not found.' });
        router.push('/invoices');
      }
      setLoading(false);
    };

    fetchPartiesAndItems();
    fetchInvoice();
  }, [id, router, toast]);

  const subtotal = invoiceItems.reduce(
    (acc, { item, quantity }) => acc + item.price * quantity,
    0
  );
  const gst = invoiceItems.reduce(
    (acc, { item, quantity }) =>
      acc + (item.price * quantity * item.gstPercentage) / 100,
    0
  );
  const total = subtotal + gst;

  const handleAddItem = () => {
    if (!selectedItemId) return;
    const existingItem = invoiceItems.find((i) => i.item.id === selectedItemId);
    if (existingItem) {
      setInvoiceItems(
        invoiceItems.map((i) =>
          i.item.id === selectedItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      const itemToAdd = items.find((i) => i.id === selectedItemId);
      if (itemToAdd) {
        setInvoiceItems([...invoiceItems, { item: itemToAdd, quantity: 1 }]);
      }
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity > 0) {
      setInvoiceItems(
        invoiceItems.map((i) => (i.item.id === itemId ? { ...i, quantity } : i))
      );
    }
  };

  const removeItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter((i) => i.item.id !== itemId));
  };

  const handleUpdateInvoice = async () => {
    if (!id || !partyId || invoiceItems.length === 0 || !invoiceDate) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a party, add at least one item, and set an invoice date.',
      });
      return;
    }

    const party = parties.find((p) => p.id === partyId);
    if (!party) return;
    
    const updatedInvoice = {
      party,
      partyId,
      items: invoiceItems,
      date: invoiceDate.toISOString().split('T')[0],
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
      totalAmount: total,
    };
    
    try {
        const docRef = doc(db, 'invoices', id as string);
        await updateDoc(docRef, updatedInvoice);
        toast({
            title: "Invoice Updated",
            description: `Invoice has been successfully updated.`,
        })
        router.push('/invoices');
    } catch (e) {
        console.error("Error updating document: ", e);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'There was an error updating the invoice. Please try again.',
        });
    }
  };

  if (loading) {
    return <EditInvoiceSkeleton />
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit Invoice ${invoice?.invoiceNumber || ''}`}
        action={
          <Button asChild variant="outline">
            <Link href="/invoices">Cancel</Link>
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                 <div>
                    <Label htmlFor="party">Party</Label>
                    <Select value={partyId} onValueChange={setPartyId}>
                        <SelectTrigger id="party">
                        <SelectValue placeholder="Select a party" />
                        </SelectTrigger>
                        <SelectContent>
                        {parties
                            .filter((p) => p.type === 'Customer')
                            .map((party) => (
                            <SelectItem key={party.id} value={party.id}>
                                {party.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
              </div>
              <div>
                <Label>Items</Label>
                <div className="flex gap-2">
                  <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} (Rs {item.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddItem}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="w-[100px]">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No items added yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {invoiceItems.map(({ item, quantity }) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="h-8 w-20 text-center"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right">Rs {item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">Rs {(item.price * quantity).toFixed(2)}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-red-500"/>
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Invoice Date</Label>
                <DatePicker date={invoiceDate} setDate={setInvoiceDate} />
              </div>
              <div>
                <Label>Due Date (Optional)</Label>
                <DatePicker date={dueDate} setDate={setDueDate} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>Rs {gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleUpdateInvoice}>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}


function EditInvoiceSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Edit Invoice..."
                action={
                <Button asChild variant="outline">
                    <Link href="/invoices">Cancel</Link>
                </Button>
                }
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                    <CardTitle>Invoice Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="party">Party</Label>
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div>
                        <Label>Items</Label>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-grow" />
                            <Skeleton className="h-10 w-28" />
                        </div>
                    </div>
                    <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
                </div>
                <div className="space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Invoice Dates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div>
                        <Label>Invoice Date</Label>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                        <Label>Due Date (Optional)</Label>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </CardContent>
                    <CardFooter>
                    <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
                </div>
            </div>
        </div>
    )
}
