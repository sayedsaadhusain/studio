import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import PageHeader from '@/components/page-header';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" />
      <StatsCards />
      <RecentInvoices />
    </div>
  );
}
