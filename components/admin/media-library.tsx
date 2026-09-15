'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader2, Upload, Copy, Trash2, ImageIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type MediaFile = { key: string; url: string };

function baseName(key: string) {
  const parts = key.split('/');
  return parts[parts.length - 1];
}

export function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/media');
      if (!res.ok) throw new Error();
      setFiles(await res.json());
    } catch {
      toast.error('Could not load media library.');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error();
      const item = await res.json();
      setFiles((prev) => [item, ...prev]);
      toast.success('Uploaded.');
    } catch {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async (item: MediaFile) => {
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: item.key }),
      });
      if (!res.ok) throw new Error();
      setFiles((prev) => prev.filter((f) => f.key !== item.key));
      toast.success('Deleted.');
    } catch {
      toast.error('Delete failed.');
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error('Could not copy URL.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Media Library</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Uploaded images are served from your R2 bucket. Upload here, then paste the URL into any image field.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-dashed p-4">
        <div>
          <p className="text-sm font-medium">Upload new image</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WebP · up to 8MB</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
        </div>
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : files.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ImageIcon className="h-7 w-7" />
            </div>
            <p className="mt-4 font-medium">No media yet</p>
            <p className="text-sm text-muted-foreground mt-1">Upload your first image to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((item) => (
            <Card key={item.key} className="overflow-hidden">
              <div className="relative h-36 w-full bg-muted">
                <Image src={item.url} alt={baseName(item.key)} fill sizes="300px" unoptimized className="object-cover" />
              </div>
              <CardContent className="p-3 space-y-2">
                <p className="truncate text-xs font-medium" title={item.key}>
                  {baseName(item.key)}
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => copyUrl(item.url)}
                  >
                    {copied === item.url ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                    {copied === item.url ? 'Copied' : 'Copy URL'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(item)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}