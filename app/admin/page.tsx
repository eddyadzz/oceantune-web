import Link from 'next/link';
import {
  Wrench,
  Briefcase,
  Images,
  FileText,
  Users,
  Database,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSessionUser } from '@/lib/admin';

async function getCounts() {
  const empty = { services: 0, portfolio: 0, carousel: 0, pages: 0, team: 0 };
  if (!prisma) return empty;
  try {
    const [services, portfolio, carousel, pages, team] = await Promise.all([
      prisma.service.count(),
      prisma.portfolioItem.count(),
      prisma.carouselSlide.count(),
      prisma.page.count(),
      prisma.user.count(),
    ]);
    return { services, portfolio, carousel, pages, team };
  } catch {
    return empty;
  }
}

export default async function AdminDashboard() {
  const [counts, user] = await Promise.all([getCounts(), getSessionUser()]);
  const isAdmin = user?.role === 'ADMIN';

  const r2Ready =
    Boolean(process.env.R2_ENDPOINT) &&
    Boolean(process.env.R2_ACCESS_KEY_ID) &&
    Boolean(process.env.R2_SECRET_ACCESS_KEY);

  const statCards = [
    { label: 'Services', value: counts.services, icon: Wrench, href: '/admin/services' },
    { label: 'Portfolio Projects', value: counts.portfolio, icon: Briefcase, href: '/admin/portfolio' },
    { label: 'Carousel Slides', value: counts.carousel, icon: Images, href: '/admin/carousel' },
    { label: 'Legal Pages', value: counts.pages, icon: FileText, href: '/admin/pages' },
    ...(isAdmin ? [{ label: 'Team Members', value: counts.team, icon: Users, href: '/admin/users' }] : []),
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, {user?.name ?? 'Admin'}. Here&apos;s what&apos;s happening on your site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="hover:border-primary/40 hover:shadow-md transition-all h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-4 font-heading text-3xl font-bold">{card.value}</p>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
            <CardDescription>Integration health for your CMS infrastructure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">PostgreSQL (Prisma)</p>
                  <p className="text-xs text-muted-foreground">
                    {prisma ? 'Connected — content is live from the database' : 'Not configured — serving static seed content'}
                  </p>
                </div>
              </div>
              <Badge variant={prisma ? 'default' : 'secondary'}>
                {prisma ? 'Online' : 'Offline'}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FolderOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">R2 Storage (mvcdn.cc)</p>
                  <p className="text-xs text-muted-foreground">
                    {r2Ready ? 'Media uploads available in the Media Library' : 'Add R2_* env vars to enable image uploads'}
                  </p>
                </div>
              </div>
              <Badge variant={r2Ready ? 'default' : 'secondary'}>
                {r2Ready ? 'Ready' : 'Not set'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Common publishing tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {[
              { label: 'Edit homepage carousel', href: '/admin/carousel' },
              { label: 'Add a service', href: '/admin/services' },
              { label: 'Add a portfolio project', href: '/admin/portfolio' },
              { label: 'Update company details', href: '/admin/company' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium hover:border-primary/40 hover:bg-muted/50 transition-colors"
              >
                {action.label}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}