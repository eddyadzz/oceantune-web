'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, X, ChevronUp, ChevronDown, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, TextInput, TextAreaArea } from './fields';

type Section = { heading: string; body: string };
type PageDoc = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  sections: Section[];
  lastUpdated?: string;
};

export function PagesEditor() {
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<PageDoc | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/pages')
      .then((r) => r.json())
      .then((data) => setPages(data))
      .catch(() => toast.error('Could not load pages.'))
      .finally(() => setLoaded(true));
  }, []);

  const updateSection = (idx: number, patch: Partial<Section>) => {
    if (!editing) return;
    const sections = editing.sections.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    setEditing({ ...editing, sections });
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    if (!editing) return;
    const next = idx + dir;
    if (next < 0 || next >= editing.sections.length) return;
    const sections = [...editing.sections];
    [sections[idx], sections[next]] = [sections[next], sections[idx]];
    setEditing({ ...editing, sections });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${editing.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      toast.success('Page saved.');
      const updated = await fetch('/api/admin/pages').then((r) => r.json());
      setPages(updated);
    } catch {
      toast.error('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setEditing(null)} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold capitalize">{editing.slug.replace('-', ' ')}</h1>
              <p className="text-muted-foreground text-sm">Edit the page content. Sections are numbered in the order shown.</p>
            </div>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Save page
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hero & SEO</CardTitle>
              <CardDescription>The page heading and search metadata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Hero title">
                <TextInput value={editing.heroTitle} onChange={(v) => setEditing({ ...editing, heroTitle: v })} />
              </Field>
              <Field label="Hero description">
                <TextAreaArea value={editing.heroDescription} onChange={(v) => setEditing({ ...editing, heroDescription: v })} rows={2} />
              </Field>
              <Field label="Meta title">
                <TextInput value={editing.metaTitle} onChange={(v) => setEditing({ ...editing, metaTitle: v })} />
              </Field>
              <Field label="Meta description">
                <TextAreaArea value={editing.metaDescription} onChange={(v) => setEditing({ ...editing, metaDescription: v })} rows={3} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Body sections</CardTitle>
              <CardDescription>Each section is a heading + paragraph.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setEditing({ ...editing, sections: [...editing.sections, { heading: '', body: '' }] })}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add section
              </Button>
              {editing.sections.map((section, idx) => (
                <div key={idx} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Section {idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => moveSection(idx, 1)} disabled={idx === editing.sections.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditing({ ...editing, sections: editing.sections.filter((_, i) => i !== idx) })}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove section"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <Input value={section.heading} onChange={(e) => updateSection(idx, { heading: e.target.value })} placeholder="Section heading" />
                  <Textarea value={section.body} onChange={(e) => updateSection(idx, { body: e.target.value })} rows={4} placeholder="Body text" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Legal Pages</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Full text control for the privacy policy and terms of service.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {pages.map((page) => (
          <Card key={page.slug}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading text-base font-semibold capitalize">{page.slug.replace('-', ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {page.sections.length} sections
                      {page.lastUpdated
                        ? ` · updated ${new Date(page.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                        : ''}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditing({ ...page })}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}