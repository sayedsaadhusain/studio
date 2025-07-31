'use client';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NAV_LINKS } from '@/lib/constants';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SidebarTitle() {
    return (
        <div className="flex items-center gap-2">
            <Button
            variant="ghost"
            size="icon"
            className="shrink-0 bg-primary/20 text-primary hover:bg-primary/30"
            >
            <Package className="h-5 w-5" />
            </Button>
            <h1 className="font-headline text-lg font-semibold text-primary">
            Grow Vyapar
            </h1>
        </div>
    )
}


export default function SiteSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTitle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_LINKS.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href)
                }
                className="font-body"
              >
                <a href={link.href}>
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="md:hidden">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
