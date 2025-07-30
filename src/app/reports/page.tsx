import PageHeader from '@/components/page-header';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockInvoices, mockItems, mockParties } from '@/lib/mock-data';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reports" />
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="party">Party Ledger</TabsTrigger>
          <TabsTrigger value="gst">GST Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Sales Summary</CardTitle>
              <CardDescription>A summary of all your sales invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.party.name}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">₹{invoice.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="party">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Party Ledger</CardTitle>
              <CardDescription>Transaction history for each party.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                 <TableHeader>
                  <TableRow>
                    <TableHead>Party Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Total Business</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {mockParties.map(party => {
                        const total = mockInvoices
                            .filter(inv => inv.party.id === party.id)
                            .reduce((sum, inv) => sum + inv.totalAmount, 0);
                        return (
                            <TableRow key={party.id}>
                                <TableCell>{party.name}</TableCell>
                                <TableCell>{party.type}</TableCell>
                                <TableCell className="text-right">₹{total.toFixed(2)}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">GST Summary</CardTitle>
              <CardDescription>A summary of GST collected from sales.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>GST Rate</TableHead>
                    <TableHead>Taxable Amount</TableHead>
                    <TableHead className="text-right">GST Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {/* This is a simplified calculation for mock purposes */}
                    <TableRow>
                        <TableCell>5%</TableCell>
                        <TableCell>₹1850.00</TableCell>
                        <TableCell className="text-right">₹92.50</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>12%</TableCell>
                        <TableCell>₹780.00</TableCell>
                        <TableCell className="text-right">₹93.60</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>18%</TableCell>
                        <TableCell>₹200.00</TableCell>
                        <TableCell className="text-right">₹36.00</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
