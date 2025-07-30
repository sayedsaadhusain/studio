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
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import type { Party } from '@/lib/types';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchParties = async () => {
      const querySnapshot = await getDocs(collection(db, "parties"));
      const partiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Party[];
      setParties(partiesData);
    };
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
    };

    try {
      const docRef = await addDoc(collection(db, "parties"), newPartyData);
      setParties([{ id: docRef.id, ...newPartyData }, ...parties]);
      toast({
        title: "Party Added",
        description: `${newPartyData.name} has been successfully added.`,
      })
      setOpen(false); // Close the dialog
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error adding the party. Please try again.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Parties"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Party
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddParty}>
                <DialogHeader>
                  <DialogTitle className="font-headline">Add New Party</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 font-body">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {parties.map((party) => (
                <TableRow key={party.id}>
                  <TableCell className="font-medium">{party.name}</TableCell>
                  <TableCell>{party.phone}</TableCell>
                  <TableCell>{party.type}</TableCell>
                  <TableCell>{party.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
