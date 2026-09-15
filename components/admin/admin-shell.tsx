'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Settings,
  Menu,
  Images,
  Wrench,
  Star,
  ShieldCheck,
  BarChart3,
  Tag,
  Briefcase,
  FileText,
  FolderOpen,
  Users,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type NavGroup = {
  label: string;
  items: { href: string; icon: LucideIcon; label: string; adminOnly?: boolean }[];
};

const NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ href: '/admin', icon: LayoutDashboard, label: 'Dashboard' }],
  },
  {
    label: 'Global',
    items: [
      { href: '/admin/company', icon: Building2, label: 'Company' },
      { href: '/admin/settings', icon: Settings, label: 'Page Settings' },
      { href: '/admin/navigation', icon: Menu, label: 'Navigation' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/carousel', icon: Images, label: 'Homepage Carousel' },
      { href: '/admin/services', icon: Wrench, label: 'Services' },
      { href: '/admin/why', icon: Star, label: 'Why Choose Us' },
      { href: '/admin/values', icon: ShieldCheck, label: 'Company Values' },
      { href: '/admin/portfolio', icon: Briefcase, label: 'Portfolio' },
      { href: '/admin/stats', icon: BarChart3, label: 'About Stats' },
      { href: '/admin/brands', icon: Tag, label: 'Homepage Brands' },
      { href: '/admin/pages', icon: FileText, label: 'Legal Pages' },
    ],
  },
  {
    label: 'Assets & Team',
    items: [
      { href: '/admin/media', icon: FolderOpen, label: 'Media Library' },
      { href: '/admin/users', icon: Users, label: 'Team & Roles', adminOnly: true },
    ],
  },
];

export function AdminShell({
  children,
  userName,
  userEmail,
  role,
}: {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  role: 'ADMIN' | 'EDITOR';
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="font-heading text-lg font-bold">
            Ocean Tune <span className="text-primary">CMS</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items
                  .filter((item) => (item.adminOnly ? role === 'ADMIN' : true))
                  .map((item) => {
                    const isActive =
                      item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <form method="post" action="/api/auth/signout">
            <input type="hidden" name="callbackUrl" value="/" />
            <Button type="submit" variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4">
        <Link href="/admin" className="font-heading text-base font-bold">
          Ocean Tune <span className="text-primary">CMS</span>
        </Link>
        <form method="post" action="/api/auth/signout" className="flex items-center gap-2">
          <input type="hidden" name="callbackUrl" value="/" />
          <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </header>
      {/* Mobile nav */}
      <nav className="lg:hidden sticky top-14 z-40 flex gap-1 overflow-x-auto border-b border-border bg-background px-3 py-2">
        {NAV.flatMap((g) => g.items)
          .filter((item) => (item.adminOnly ? role === 'ADMIN' : true))
          .map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      {/* Main */}
      <main className="lg:pl-64">
        <header className="hidden lg:flex items-center justify-between border-b border-border bg-background px-8 py-3">
          <div className="text-sm text-muted-foreground">
            {/* Breadcrumb */}
            <span className="inline-flex items-center gap-1">
              Admin <ChevronRight className="h-3.5 w-3.5" /> Manage your website content
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">{userName ?? 'User'}</p>
              <p className="text-xs text-muted-foreground leading-tight">{userEmail}</p>
            </div>
            <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>
              {role === 'ADMIN' ? 'Admin' : 'Editor'}
            </Badge>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}