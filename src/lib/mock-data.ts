import type { Party, Item, Invoice } from './types';

export const mockParties: Party[] = [
  { id: '1', name: 'Rajesh Kumar', phone: '9876543210', address: '123, MG Road, Bangalore', type: 'Customer' },
  { id: '2', name: 'Priya Sharma', phone: '9876543211', address: '456, Linking Road, Mumbai', type: 'Customer' },
  { id: '3', name: 'Amit Singh', phone: '9876543212', address: '789, Connaught Place, Delhi', type: 'Supplier' },
  { id: '4', name: 'Sunita Devi', phone: '9876543213', address: '101, Park Street, Kolkata', type: 'Customer' },
];

export const mockItems: Item[] = [
  { id: '1', name: 'Sona Masoori Rice - 1kg', price: 60, hsnCode: '1006', gstPercentage: 5 },
  { id: '2', name: 'Aashirvaad Atta - 5kg', price: 250, hsnCode: '1101', gstPercentage: 5 },
  { id: '3', name: 'Tata Salt - 1kg', price: 25, hsnCode: '2501', gstPercentage: 0 },
  { id: '4', name: 'Amul Butter - 500g', price: 260, hsnCode: '0405', gstPercentage: 12 },
  { id: '5', name: 'Parle-G Biscuits - 100g', price: 10, hsnCode: '1905', gstPercentage: 18 },
];

export const mockInvoices: Invoice[] = [
  { 
    id: '1', 
    invoiceNumber: 'INV-001', 
    party: mockParties[0], 
    items: [
      { item: mockItems[0], quantity: 5 },
      { item: mockItems[1], quantity: 2 },
    ],
    date: '2023-10-15', 
    dueDate: '2023-10-30', 
    totalAmount: 800, 
    status: 'Paid' 
  },
  { 
    id: '2', 
    invoiceNumber: 'INV-002', 
    party: mockParties[1], 
    items: [
      { item: mockItems[2], quantity: 10 },
      { item: mockItems[4], quantity: 20 },
    ],
    date: '2023-10-20', 
    dueDate: '2023-11-04', 
    totalAmount: 450, 
    status: 'Due' 
  },
  { 
    id: '3', 
    invoiceNumber: 'INV-003', 
    party: mockParties[3], 
    items: [
      { item: mockItems[3], quantity: 3 },
    ],
    date: '2023-10-22', 
    dueDate: '2023-11-06', 
    totalAmount: 780, 
    status: 'Partial' 
  },
  { 
    id: '4', 
    invoiceNumber: 'INV-004', 
    party: mockParties[0], 
    items: [
      { item: mockItems[1], quantity: 1 },
      { item: mockItems[4], quantity: 5 },
    ],
    date: '2023-10-25', 
    dueDate: '2023-11-09', 
    totalAmount: 300, 
    status: 'Due' 
  },
];
