'use client'

import { useState } from 'react';
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

import { mockItems } from '@/lib/mock-data';
import type { Item } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [open, setOpen] = useState(false);

  // In a real app, this would be a form with validation
  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newItem: Item = {
      id: (items.length + 1).toString(),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      hsnCode: formData.get('hsnCode') as string,
      gstPercentage: Number(formData.get('gst')),
    };
    setItems([...items, newItem]);
    setOpen(false); // Close the dialog
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
