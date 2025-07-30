import type { Timestamp } from 'firebase/firestore';

export type Party = {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: 'Customer' | 'Supplier';
  createdAt: Timestamp;
};

export type Item = {
  id: string;
  name: string;
  price: number;
  hsnCode: string;
  gstPercentage: number;
};

export type InvoiceItem = {
  item: Item;
  quantity: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  party: Party;
  partyId: string;
  items: InvoiceItem[];
  date: string;
  dueDate: string;
  totalAmount: number;
  status: 'Paid' | 'Due' | 'Partial';
};
