import type { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

type PageHeaderProps = {
  title: string;
  action?: ReactNode;
};

export default function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <h1 className="font-headline text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </h1>
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}
