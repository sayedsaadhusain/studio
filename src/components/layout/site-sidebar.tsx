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
} from '@/components/ui/sidebar';
import { NAV_LINKS } from '@/lib/constants';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

const BottomNavigation = () => {
    const pathname = usePathname();
    return (
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t border-border">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                {NAV_LINKS.map(link => (
                     <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
                            (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)) ? "text-primary" : "text-muted-foreground"
                        )}
                     >
                        <link.icon className="w-5 h-5 mb-1" />
                        <span className="text-xs">{link.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}


export default function SiteSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <BottomNavigation />;
  }

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
    </Sidebar>
  );
}
