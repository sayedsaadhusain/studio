import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import { AIInsights } from '@/components/dashboard/ai-insights';
import PageHeader from '@/components/page-header';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" />
      <StatsCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentInvoices />
        </div>
        <div className="lg:col-span-1">
          <AIInsights />
        </div>
      </div>
    </div>
  );
}
