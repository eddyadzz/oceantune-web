'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ResourceManager, type FieldDef, type ColumnDef } from '@/components/admin/resource-manager';

const fields: FieldDef[] = [
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'text', key: 'headline', label: 'Headline' },
  { type: 'textarea', key: 'description', label: 'Description', rows: 3 },
  { type: 'image', key: 'image', label: 'Background image' },
  { type: 'icon', key: 'icon', label: 'Icon' },
  { type: 'number', key: 'order', label: 'Order' },
  { type: 'toggle', key: 'active', label: 'Active on homepage' },
];

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title' },
  { key: 'headline', label: 'Headline' },
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
    render: (row) => <Badge variant={row.active ? 'default' : 'secondary'}>{row.active ? 'Active' : 'Hidden'}</Badge>,
  },
];

export default function AdminCarouselPage() {
  return (
    <ResourceManager
      resource="carousel"
      title="Carousel Slides"
      description="Slides shown in the homepage hero. The first active slide appears first."
      fields={fields}
      columns={columns}
      defaults={{ title: '', headline: '', description: '', image: '', icon: 'Anchor', order: 0, active: true }}
    />
  );
}