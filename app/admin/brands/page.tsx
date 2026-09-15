'use client';

import Image from 'next/image';
import { ResourceManager, type FieldDef, type ColumnDef } from '@/components/admin/resource-manager';

const fields: FieldDef[] = [
  { type: 'text', key: 'name', label: 'Brand name' },
  { type: 'image', key: 'image', label: 'Logo image' },
  { type: 'number', key: 'order', label: 'Order' },
];

const columns: ColumnDef[] = [
  { key: 'name', label: 'Brand' },
  {
    key: 'image',
    label: 'Logo',
    render: (row) =>
      row.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={String(row.image)}
          alt={String(row.name ?? '')}
          className="h-8 w-auto object-contain"
        />
      ) : (
        <span className="text-muted-foreground text-sm">No logo</span>
      ),
  },
];

export default function AdminBrandsPage() {
  return (
    <ResourceManager
      resource="brands"
      title="Homepage Brands"
      description="Brand logos in the “Brands We Work With” section. Upload or paste a logo URL; a brand without an image falls back to its name in text."
      fields={fields}
      columns={columns}
      defaults={{ name: '', image: '', order: 0 }}
    />
  );
}