'use client'

import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { collection, addDoc, getDocs, serverTimestamp, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';

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
  DialogClose
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import type { Party } from '@/lib/types';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const { toast } = useToast();

  const fetchParties = async () => {
    const querySnapshot = await getDocs(collection(db, "parties"));
    const partiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Party[];
    setParties(partiesData);
  };
  
  useEffect(() => {
    fetchParties();
  }, []);

  const handleAddParty = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPartyData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as 'Customer' | 'Supplier',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "parties"), newPartyData);
      toast({
        title: "Party Added",
        description: `${newPartyData.name} has been successfully added.`,
      });
      fetchParties();
      setIsAddDialogOpen(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error adding the party. Please try again.',
      });
    }
  };

  const handleEditParty = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedParty) return;

    const formData = new FormData(event.currentTarget);
    const updatedPartyData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as 'Customer' | 'Supplier',
    };

    try {
      const docRef = doc(db, 'parties', selectedParty.id);
      await updateDoc(docRef, updatedPartyData);
      toast({
        title: "Party Updated",
        description: `${updatedPartyData.name} has been successfully updated.`,
      });
      fetchParties();
      setIsEditDialogOpen(false);
      setSelectedParty(null);
    } catch (e) {
      console.error("Error updating document: ", e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error updating the party. Please try again.',
      });
    }
  };

  const openEditDialog = (party: Party) => {
    setSelectedParty(party);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (party: Party) => {
    setSelectedParty(party);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteParty = async () => {
    if (!selectedParty) return;
    try {
      await deleteDoc(doc(db, 'parties', selectedParty.id));
      toast({
        title: 'Party Deleted',
        description: `${selectedParty.name} has been successfully deleted.`,
      });
      fetchParties();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error deleting the party.',
      });
      console.error('Error deleting document: ', e);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedParty(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Parties"
        action={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Party
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddParty}>
                <DialogHeader>
                  <DialogTitle>Add New Party</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">Phone</Label>
                    <Input id="phone" name="phone" type="tel" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">Address</Label>
                    <Input id="address" name="address" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Type</Label>
                    <RadioGroup name="type" defaultValue="Customer" className="col-span-3 flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Customer" id="r1" />
                        <Label htmlFor="r1">Customer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Supplier" id="r2" />
                        <Label htmlFor="r2">Supplier</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                      <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Party</Button>
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
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parties.map((party) => (
                <TableRow key={party.id}>
                  <TableCell className="font-medium">{party.name}</TableCell>
                  <TableCell>{party.phone}</TableCell>
                  <TableCell>{party.type}</TableCell>
                  <TableCell>{party.address}</TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(party)}>
                        <Edit className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDeleteDialog(party)}>
                        <Trash2 className="h-4 w-4 text-red-500"/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Party Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleEditParty}>
            <DialogHeader>
              <DialogTitle>Edit Party</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" defaultValue={selectedParty?.name} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" name="phone" type="tel" className="col-span-3" defaultValue={selectedParty?.phone} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input id="address" name="address" className="col-span-3" defaultValue={selectedParty?.address} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <RadioGroup name="type" defaultValue={selectedParty?.type} className="col-span-3 flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Customer" id="r1-edit" />
                    <Label htmlFor="r1-edit">Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Supplier" id="r2-edit" />
                    <Label htmlFor="r2-edit">Supplier</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={() => setSelectedParty(null)}>Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Party Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete the party "{selectedParty?.name}". This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedParty(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteParty} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
