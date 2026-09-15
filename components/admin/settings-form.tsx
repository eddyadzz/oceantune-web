'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Field, TextInput, TextAreaArea, ImageUploader } from './fields';
import { themePresets, isHexColor } from '@/lib/theme';
import { defaultSettings } from '@/lib/defaults';

type Group = { label: string; keys: [string, string][] };

const COLOR_KEYS = new Set(['theme.primary', 'theme.secondary']);

export function SettingsForm() {
  const [values, setValues] = useState<Record<string, string>>(defaultSettings);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setValues(data.settings ?? defaultSettings);
        setGroups(Object.values(data.groups ?? {}) as unknown as Group[]);
      })
      .catch(() => toast.error('Could not load settings.'))
      .finally(() => setLoaded(true));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: values }),
      });
      if (!res.ok) throw new Error();
      toast.success('Settings saved.');
    } catch {
      toast.error('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const setValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Page Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Headlines, section headings, copy, and theme/branding across the marketing pages.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          Save all
        </Button>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const isTheme = group.label === 'Theme & Branding';
          return (
            <Card key={group.label}>
              <CardHeader>
                <CardTitle className="text-base">{group.label}</CardTitle>
                {isTheme && (
                  <CardDescription>
                    Pick a preset or set your own colors. Changes apply to the whole site.
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-5">
                {isTheme && (
                  <div className="space-y-2">
                    <Label className="text-sm">Color presets</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {themePresets.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => {
                            setValue('theme.primary', p.primary);
                            setValue('theme.secondary', p.secondary);
                          }}
                          className="flex items-center gap-2 rounded-lg border p-2 text-left text-xs hover:border-primary/50 transition-colors"
                        >
                          <span
                            className="flex h-6 w-9 shrink-0 rounded"
                            style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.secondary})` }}
                          />
                          <span className="truncate">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {group.keys.map(([key, label]) => {
                    if (COLOR_KEYS.has(key)) {
                      return (
                        <Field key={key} label={label} hint={key}>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={isHexColor(values[key] ?? '') ? values[key] : '#000000'}
                              onChange={(e) => setValue(key, e.target.value)}
                              className="h-9 w-12 shrink-0 cursor-pointer rounded-md border bg-transparent p-1"
                            />
                            <TextInput
                              value={values[key] ?? ''}
                              onChange={(v) => setValue(key, v)}
                              placeholder="#0A335C"
                            />
                          </div>
                        </Field>
                      );
                    }

                    if (key === 'brand.logoImage') {
                      return (
                        <Field key={key} label={label} hint={key} >
                          <ImageUploader value={values[key] ?? ''} onChange={(v) => setValue(key, v)} />
                        </Field>
                      );
                    }

                    return (
                      <Field key={key} label={label} hint={key}>
                        {label.toLowerCase().includes('description') ? (
                          <TextAreaArea value={values[key] ?? ''} onChange={(v) => setValue(key, v)} rows={2} />
                        ) : (
                          <TextInput value={values[key] ?? ''} onChange={(v) => setValue(key, v)} />
                        )}
                      </Field>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}