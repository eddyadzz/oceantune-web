'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type LinkRow = { id?: string; href: string; label: string };

export function NavEditor() {
  const [nav, setNav] = useState<LinkRow[]>([]);
  const [footer, setFooter] = useState<LinkRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [navDraft, setNavDraft] = useState({ href: '', label: '' });
  const [footerDraft, setFooterDraft] = useState({ href: '', label: '' });

  useEffect(() => {
    fetch('/api/admin/navigation')
      .then((r) => r.json())
      .then((data) => {
        setNav(data.nav ?? []);
        setFooter(data.footer ?? []);
      })
      .catch(() => toast.error('Could not load navigation.'))
      .finally(() => setLoaded(true));
  }, []);

  const move = (list: LinkRow[], setList: (v: LinkRow[]) => void, idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    setList(copy);
  };

  const add = (list: LinkRow[], setList: (v: LinkRow[]) => void, draft: LinkRow, setDraft: (v: LinkRow) => void) => {
    if (!draft.href.trim() || !draft.label.trim()) {
      toast.error('Both label and link are required.');
      return;
    }
    setList([...list, { ...draft }]);
    setDraft({ href: '', label: '' });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nav: nav.map(({ href, label }) => ({ href, label })),
          footer: footer.map(({ href, label }) => ({ href, label })),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Navigation saved.');
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

  const renderList = (
    title: string,
    description: string,
    list: LinkRow[],
    draft: LinkRow,
    setDraft: (v: LinkRow) => void,
    setList: (v: LinkRow[]) => void
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Label</Label>
            <Input
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              placeholder="e.g. About"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Link</Label>
            <Input
              value={draft.href}
              onChange={(e) => setDraft({ ...draft, href: e.target.value })}
              placeholder="/about"
            />
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={() => add(list, setList, draft, setDraft)}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add link
        </Button>

        <div className="space-y-1.5">
          {list.map((link, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2"
            >
              <div className="flex flex-col">
                <button onClick={() => move(list, setList, idx, -1)} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => move(list, setList, idx, 1)} disabled={idx === list.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{link.label}</p>
                <p className="text-xs text-muted-foreground truncate">{link.href}</p>
              </div>
              <button
                onClick={() => setList(list.filter((_, i) => i !== idx))}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Navigation</h1>
          <p className="text-muted-foreground text-sm mt-1">
            The header menu and footer quick links. Reorder with the arrows.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          Save navigation
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {renderList('Header menu', 'Shown in the navbar (desktop + mobile).', nav, navDraft, setNavDraft, setNav)}
        {renderList('Footer links', 'Shown in the footer quick links.', footer, footerDraft, setFooterDraft, setFooter)}
      </div>
    </div>
  );
}