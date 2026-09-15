'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Field,
  TextInput,
  TextAreaArea,
  ImageUploader,
  IconSelect,
  ToggleField,
  NumberField,
  StringListEditor,
  UrlListEditor,
  ProcessListEditor,
} from './fields';

export type FieldDef =
  | { type: 'text'; key: string; label: string; placeholder?: string }
  | { type: 'slug'; key: string; label: string }
  | { type: 'textarea'; key: string; label: string; rows?: number }
  | { type: 'image'; key: string; label?: string }
  | { type: 'icon'; key: string; label?: string }
  | { type: 'toggle'; key: string; label?: string }
  | { type: 'number'; key: string; label?: string }
  | { type: 'stringList'; key: string; label: string }
  | { type: 'urlList'; key: string; label: string }
  | { type: 'processList'; key: string; label: string };

export type ColumnDef = {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
};

export function ResourceManager({
  resource,
  title,
  description,
  fields,
  columns,
  defaults,
  canReorder = true,
}: {
  resource: string;
  title: string;
  description: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  defaults: Record<string, unknown>;
  canReorder?: boolean;
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const endpoint = `/api/admin/${resource}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Could not load data.');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const fieldValue = (key: string, type: FieldDef['type']) => {
    const value = form[key];
    switch (type) {
      case 'number':
        return typeof value === 'number' ? value : 0;
      case 'toggle':
        return Boolean(value);
      case 'stringList':
        return Array.isArray(value) ? (value as string[]) : [];
      case 'urlList':
        return Array.isArray(value) ? (value as string[]) : [];
      case 'processList':
        return Array.isArray(value) ? (value as { step: string; description: string }[]) : [];
      default:
        return typeof value === 'string' ? value : '';
    }
  };

  const setField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...defaults });
    setOpen(true);
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  };

  const submit = async () => {
    setSaving(true);
    try {
      const url = editing ? `${endpoint}/${editing.id}` : endpoint;
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Save failed');
      }
      toast.success(editing ? 'Changes saved.' : 'Created.');
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${endpoint}/${confirmId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted.');
      setConfirmId(null);
      load();
    } catch {
      toast.error('Could not delete.');
    } finally {
      setDeleting(false);
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= rows.length) return;
    const reordered = [...rows];
    const a = reordered[index];
    const b = reordered[next];
    const aOrder = Number(a.order ?? 0);
    const bOrder = Number(b.order ?? 0);
    reordered[index] = { ...a, order: bOrder };
    reordered[next] = { ...b, order: aOrder };
    setRows(reordered);
    try {
      await Promise.all([
        fetch(`${endpoint}/${a.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...a, order: bOrder }),
        }),
        fetch(`${endpoint}/${b.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...b, order: aOrder }),
        }),
      ]);
    } catch {
      toast.error('Reorder failed.');
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={load}>
          Refresh
        </Button>
        <Button onClick={openCreate} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Add {title.replace(/s$/, '')}
        </Button>
      </div>

      <div className="rounded-xl border bg-background">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No items yet. Add your first one.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {canReorder && <TableHead className="w-12" />}
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={row.id as string}>
                  {canReorder && (
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => move(idx, -1)}
                          disabled={idx === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => move(idx, 1)}
                          disabled={idx === rows.length - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setConfirmId(row.id as string)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create / edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}</DialogTitle>
            <DialogDescription>Fields marked with icons can also accept external image URLs.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map((f) => {
              switch (f.type) {
                case 'text':
                case 'slug':
                  return (
                    <Field key={f.key} label={f.label} hint={f.type === 'slug' ? 'URL-safe identifier. Leave blank to auto-generate.' : undefined}>
                      <TextInput value={String(fieldValue(f.key, f.type))} onChange={(v) => setField(f.key, v)} placeholder={'placeholder' in f ? f.placeholder : undefined} />
                    </Field>
                  );
                case 'textarea':
                  return (
                    <Field key={f.key} label={f.label}>
                      <TextAreaArea value={String(fieldValue(f.key, f.type))} onChange={(v) => setField(f.key, v)} rows={f.rows} />
                    </Field>
                  );
                case 'image':
                  return (
                    <Field key={f.key} label={f.label ?? 'Image'}>
                      <ImageUploader value={String(fieldValue(f.key, f.type))} onChange={(v) => setField(f.key, v)} />
                    </Field>
                  );
                case 'icon':
                  return (
                    <Field key={f.key} label={f.label ?? 'Icon'}>
                      <IconSelect value={String(fieldValue(f.key, f.type))} onChange={(v) => setField(f.key, v)} />
                    </Field>
                  );
                case 'toggle':
                  return (
                    <div key={f.key} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm font-medium">{f.label ?? f.key}</span>
                      <ToggleField checked={Boolean(fieldValue(f.key, f.type))} onChange={(v) => setField(f.key, v)} />
                    </div>
                  );
                case 'number':
                  return (
                    <Field key={f.key} label={f.label ?? f.key}>
                      <NumberField value={Number(fieldValue(f.key, f.type) || 0)} onChange={(v) => setField(f.key, v)} />
                    </Field>
                  );
                case 'stringList':
                  return (
                    <StringListEditor
                      key={f.key}
                      label={f.label}
                      values={fieldValue(f.key, f.type) as string[]}
                      onChange={(v) => setField(f.key, v)}
                    />
                  );
                case 'urlList':
                  return (
                    <UrlListEditor
                      key={f.key}
                      label={f.label}
                      values={fieldValue(f.key, f.type) as string[]}
                      onChange={(v) => setField(f.key, v)}
                    />
                  );
                case 'processList':
                  return (
                    <ProcessListEditor
                      key={f.key}
                      values={fieldValue(f.key, f.type) as { step: string; description: string }[]}
                      onChange={(v) => setField(f.key, v)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={Boolean(confirmId)} onOpenChange={() => setConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}