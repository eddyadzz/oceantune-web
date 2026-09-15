'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ResourceManager, type FieldDef, type ColumnDef } from '@/components/admin/resource-manager';

const fields: FieldDef[] = [
  { type: 'slug', key: 'slug', label: 'Slug' },
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'text', key: 'category', label: 'Category', placeholder: 'e.g. Marine, Construction, Design' },
  { type: 'textarea', key: 'description', label: 'Description', rows: 3 },
  { type: 'image', key: 'image', label: 'Cover image' },
  { type: 'urlList', key: 'gallery', label: 'Gallery images' },
  { type: 'text', key: 'client', label: 'Client' },
  { type: 'textarea', key: 'scope', label: 'Scope of work', rows: 3 },
  { type: 'textarea', key: 'outcome', label: 'Outcome', rows: 3 },
  { type: 'number', key: 'order', label: 'Order' },
  { type: 'toggle', key: 'active', label: 'Visible on website' },
];

const columns: ColumnDef[] = [
  {
    key: 'title',
    label: 'Project',
    render: (row) => (
      <div>
        <p className="font-medium">{String(row.title)}</p>
        <p className="text-xs text-muted-foreground">/{String(row.slug)}</p>
      </div>
    ),
  },
  { key: 'category', label: 'Category' },
  {
    key: 'image',
    label: 'Image',
    render: (row) =>
      row.image ? (
        <div className="relative h-12 w-20 overflow-hidden rounded-md">
          <Image src={String(row.image)} alt="" fill sizes="80px" unoptimized className="object-cover" />
        </div>
      ) : (
        '—'
      ),
  },
  {
    key: 'active',
    label: 'Status',
    render: (row) => <Badge variant={row.active ? 'default' : 'secondary'}>{row.active ? 'Live' : 'Hidden'}</Badge>,
  },
];

export default function AdminPortfolioPage() {
  return (
    <ResourceManager
      resource="portfolio"
      title="Portfolio Projects"
      description="Projects shown on the homepage, portfolio grid, and project detail pages."
      fields={fields}
      columns={columns}
      defaults={{
        slug: '',
        title: '',
        category: '',
        description: '',
        image: '',
        gallery: [],
        client: '',
        scope: '',
        outcome: '',
        order: 0,
        active: true,
      }}
    />
  );
}