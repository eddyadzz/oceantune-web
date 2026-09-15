import Link from 'next/link';
import { ArrowLeft, DatabaseZap } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { LoginForm } from '@/components/admin/login-form';
import { Logo } from '@/components/site/logo';

export default async function AdminLoginPage() {
  const dbReady = Boolean(prisma);

  return (
    <div className="relative flex min-h-screen items-center justify-center gradient-ocean-dark px-4 py-12">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-secondary blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <Logo size="sm" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-1">Admin Login</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to manage Ocean Tune content.
          </p>

          {dbReady ? (
            <LoginForm />
          ) : (
            <div className="rounded-xl bg-muted p-4 text-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <DatabaseZap className="h-4 w-4 text-primary" />
                Database not configured
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Add <code className="rounded bg-muted-foreground/10 px-1">DATABASE_URL</code> to
                your environment, run <code className="rounded bg-muted-foreground/10 px-1">npx prisma migrate deploy</code>{' '}
                and <code className="rounded bg-muted-foreground/10 px-1">npm run db:seed</code>,
                then log in with the seeded admin account.
              </p>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>
      </div>
    </div>
  );
}