'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { iconOptions } from '@/lib/icons';

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function TextAreaArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
    />
  );
}

export function NumberField({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  );
}

export function ToggleField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="text-sm text-muted-foreground">{label ?? (checked ? 'Active' : 'Inactive')}</span>
    </div>
  );
}

export function IconSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value || iconOptions[0]} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an icon" />
      </SelectTrigger>
      <SelectContent>
        {iconOptions.map((name) => (
          <SelectItem key={name} value={name}>
            {name.replace(/([A-Z])/g, ' $1').trim()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

async function uploadToR2(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? 'Upload failed');
  }
  return (await res.json()).url as string;
}

export function ImageUploader({
  value,
  onChange,
  label = 'Image',
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadToR2(file);
      onChange(url);
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste an image URL or upload…"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="shrink-0"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
              const file = input.files?.[0];
              if (file) handleFile(file);
            };
            input.click();
          }}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {label === 'Image' ? 'Upload' : label}
        </Button>
      </div>
      {value && (
        <div className="relative h-28 w-40 overflow-hidden rounded-lg border">
          <Image
            src={value}
            alt=""
            fill
            sizes="160px"
            unoptimized
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0.3';
            }}
          />
        </div>
      )}
    </div>
  );
}

export function StringListEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...values, v]);
    setDraft('');
  };

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add an item…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" size="icon" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ul className="space-y-1">
        {values.map((v, idx) => (
          <li key={idx} className="flex items-center justify-between gap-2 rounded-md bg-muted/60 px-3 py-1.5 text-sm">
            <span className="truncate">{v}</span>
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== idx))}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UrlListEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const addUrl = async (file: File) => {
    try {
      const url = await uploadToR2(file);
      onChange([...values, url]);
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
              const file = input.files?.[0];
              if (file) addUrl(file);
            };
            input.click();
          }}
        >
          <Upload className="mr-1 h-3.5 w-3.5" />
          Add image
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {values.map((url, idx) => (
          <div key={idx} className="relative h-24 overflow-hidden rounded-lg border group">
            <Image src={url} alt="" fill sizes="50vw" unoptimized className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== idx))}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                const next = [...values];
                next[idx] = e.target.value;
                onChange(next);
              }}
              className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 border-0 outline-none focus:opacity-100"
              placeholder="URL"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProcessListEditor({
  values,
  onChange,
}: {
  values: { step: string; description: string }[];
  onChange: (v: { step: string; description: string }[]) => void;
}) {
  const [step, setStep] = useState('');
  const [description, setDescription] = useState('');

  const add = () => {
    if (!step.trim()) return;
    onChange([...values, { step: step.trim(), description: description.trim() }]);
    setStep('');
    setDescription('');
  };

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <Label className="text-sm font-medium">Process steps</Label>
      <div className="space-y-2">
        <Input value={step} onChange={(e) => setStep(e.target.value)} placeholder={'Step name (e.g. "Identify")'} />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Step description"
          rows={2}
        />
        <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add step
        </Button>
      </div>
      <ol className="space-y-2">
        {values.map((v, idx) => (
          <li key={idx} className="rounded-md border bg-muted/40 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">
                {idx + 1}. {v.step}
              </span>
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== idx))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-muted-foreground mt-1">{v.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}