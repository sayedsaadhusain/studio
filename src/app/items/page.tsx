'use client'

import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { collection, addDoc, getDocs } from 'firebase/firestore';

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { Item } from '@/lib/types';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];
      setItems(itemsData);
    };
    fetchItems();
  }, []);

  const handleAddItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newItemData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      hsnCode: formData.get('hsnCode') as string,
      gstPercentage: Number(formData.get('gst')),
    };
    
    try {
      const docRef = await addDoc(collection(db, "items"), newItemData);
      setItems([...items, { id: docRef.id, ...newItemData }]);
      toast({
        title: "Item Added",
        description: `${newItemData.name} has been successfully added.`,
      })
      setOpen(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error adding the item. Please try again.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Items"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddItem}>
                <DialogHeader>
                  <DialogTitle className="font-headline">Add New Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 font-body">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" className="col-span-3" required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price</Label>
                    <Input id="price" name="price" type="number" className="col-span-3" required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hsnCode" className="text-right">HSN Code</Label>
                    <Input id="hsnCode" name="hsnCode" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gst" className="text-right">GST %</Label>
                    <Input id="gst" name="gst" type="number" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Item</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>HSN Code</TableHead>
                <TableHead>GST %</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.hsnCode}</TableCell>
                  <TableCell>{item.gstPercentage}%</TableCell>
                  <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
