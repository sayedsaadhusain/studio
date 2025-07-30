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
import { Badge } from '@/components/ui/badge';
import { mockInvoices } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function RecentInvoices() {
  const recentInvoices = mockInvoices.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Invoices</CardTitle>
        <CardDescription className="font-body">A list of your most recent invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.party.name}</TableCell>
                <TableCell>₹{invoice.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'font-semibold',
                      invoice.status === 'Paid' && 'border-green-500 text-green-600',
                      invoice.status === 'Due' && 'border-red-500 text-red-600',
                      invoice.status === 'Partial' && 'border-yellow-500 text-yellow-600'
                    )}
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
