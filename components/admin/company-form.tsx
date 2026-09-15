'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, TextInput, TextAreaArea } from './fields';
import { company as seedCompany } from '@/lib/site-data';

type CompanyState = {
  name: string;
  legalName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  social: { facebook: string; instagram: string; twitter: string; linkedin: string };
};

const EMPTY: CompanyState = {
  name: seedCompany.name,
  legalName: seedCompany.legalName,
  tagline: seedCompany.tagline,
  address: '',
  phone: '',
  email: '',
  description: '',
  social: { facebook: '', instagram: '', twitter: '', linkedin: '' },
};

export function CompanyForm() {
  const [form, setForm] = useState<CompanyState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/company')
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name ?? '',
          legalName: data.legalName ?? '',
          tagline: data.tagline ?? '',
          address: data.address ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
          description: data.description ?? '',
          social: {
            facebook: data.social?.facebook ?? '',
            instagram: data.social?.instagram ?? '',
            twitter: data.social?.twitter ?? '',
            linkedin: data.social?.linkedin ?? '',
          },
        });
      })
      .catch(() => toast.error('Could not load company data.'))
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof CompanyState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success('Company details saved.');
    } catch {
      toast.error('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Company</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Used across the navbar, footer, contact page, and legal pages.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
            <CardDescription>Core business information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Company name">
              <TextInput value={form.name} onChange={(v) => set('name', v)} />
            </Field>
            <Field label="Legal name" hint="Used in the footer copyright line.">
              <TextInput value={form.legalName} onChange={(v) => set('legalName', v)} />
            </Field>
            <Field label="Tagline">
              <TextInput value={form.tagline} onChange={(v) => set('tagline', v)} />
            </Field>
            <Field label="Address">
              <TextInput value={form.address} onChange={(v) => set('address', v)} />
            </Field>
            <Field label="Phone" hint="Shown in the navbar and call buttons.">
              <TextInput value={form.phone} onChange={(v) => set('phone', v)} />
            </Field>
            <Field label="Email" hint="Receives contact form messages via formsubmit.co.">
              <TextInput value={form.email} onChange={(v) => set('email', v)} />
            </Field>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
              <CardDescription>Shown in the footer.</CardDescription>
            </CardHeader>
            <CardContent>
              <TextAreaArea value={form.description} onChange={(v) => set('description', v)} rows={5} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social links</CardTitle>
              <CardDescription>Used in the footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Field label="Facebook">
                <TextInput value={form.social.facebook} onChange={(v) => setForm((p) => ({ ...p, social: { ...p.social, facebook: v } }))} />
              </Field>
              <Field label="Instagram">
                <TextInput value={form.social.instagram} onChange={(v) => setForm((p) => ({ ...p, social: { ...p.social, instagram: v } }))} />
              </Field>
              <Field label="Twitter / X">
                <TextInput value={form.social.twitter} onChange={(v) => setForm((p) => ({ ...p, social: { ...p.social, twitter: v } }))} />
              </Field>
              <Field label="LinkedIn">
                <TextInput value={form.social.linkedin} onChange={(v) => setForm((p) => ({ ...p, social: { ...p.social, linkedin: v } }))} />
              </Field>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}