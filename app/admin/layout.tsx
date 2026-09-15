import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminShell } from '@/components/admin/admin-shell';
import { DatabaseZap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');

  // Database not configured — show setup guidance instead of the app.
  if (!prisma) {
    return (
      <AdminShell userName={session.user.name} userEmail={session.user.email} role={session.user.role}>
        <div className="mx-auto max-w-xl">
          <div className="rounded-xl border bg-background p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <DatabaseZap className="h-5 w-5" />
              </div>
              <h1 className="font-heading text-xl font-bold">Database not configured</h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The admin CMS needs a PostgreSQL database. Add the following to your environment
              (.env or Netlify), then run the migrations and seed:
            </p>
            <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto mb-4">
{`DATABASE_URL=postgresql://user:pass@host:5432/oceantune

# then run:
npx prisma migrate deploy
npm run db:seed`}
            </pre>
            <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                The public website keeps working on static content until the database is wired up.
              </span>
            </div>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell userName={session.user.name} userEmail={session.user.email} role={session.user.role}>
      {children}
    </AdminShell>
  );
}

// Keep the route dynamic so the session check always runs fresh.
export const dynamic = 'force-dynamic';