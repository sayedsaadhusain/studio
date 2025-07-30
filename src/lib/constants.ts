import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, FileText, Package, BarChart3 } from 'lucide-react';

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/items', label: 'Items', icon: Package },
  { href: '/parties', label: 'Parties', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];
