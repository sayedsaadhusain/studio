'use client'

import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { Item } from '@/lib/types';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];
    setItems(itemsData);
  };

  useEffect(() => {
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
      await addDoc(collection(db, "items"), newItemData);
      toast({
        title: "Item Added",
        description: `${newItemData.name} has been successfully added.`,
      })
      fetchItems();
      setIsAddDialogOpen(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error adding the item. Please try again.',
      });
    }
  };

  const handleEditItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedItem) return;

    const formData = new FormData(event.currentTarget);
    const updatedItemData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      hsnCode: formData.get('hsnCode') as string,
      gstPercentage: Number(formData.get('gst')),
    };
    
    try {
      const docRef = doc(db, 'items', selectedItem.id);
      await updateDoc(docRef, updatedItemData);
      toast({
        title: "Item Updated",
        description: `${updatedItemData.name} has been successfully updated.`,
      });
      fetchItems();
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    } catch (e) {
      console.error("Error updating document: ", e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error updating the item. Please try again.',
      });
    }
  };


  const openEditDialog = (item: Item) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    try {
      await deleteDoc(doc(db, 'items', selectedItem.id));
      toast({
        title: 'Item Deleted',
        description: `${selectedItem.name} has been successfully deleted.`,
      });
      fetchItems();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error deleting the item.',
      });
      console.error('Error deleting document: ', e);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Items"
        action={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddItem}>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.hsnCode}</TableCell>
                  <TableCell>{item.gstPercentage}%</TableCell>
                  <TableCell className="text-right">Rs {item.price.toFixed(2)}</TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(item)}>
                        <Edit className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDeleteDialog(item)}>
                        <Trash2 className="h-4 w-4 text-red-500"/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <form onSubmit={handleEditItem}>
                <DialogHeader>
                  <DialogTitle>Edit Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" className="col-span-3" defaultValue={selectedItem?.name} required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price</Label>
                    <Input id="price" name="price" type="number" className="col-span-3" defaultValue={selectedItem?.price} required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hsnCode" className="text-right">HSN Code</Label>
                    <Input id="hsnCode" name="hsnCode" className="col-span-3" defaultValue={selectedItem?.hsnCode} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gst" className="text-right">GST %</Label>
                    <Input id="gst" name="gst" type="number" className="col-span-3" defaultValue={selectedItem?.gstPercentage}/>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
      </Dialog>

      {/* Delete Item Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete the item "{selectedItem?.name}". This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedItem(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
