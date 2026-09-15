'use client';

import { ResourceManager, type FieldDef, type ColumnDef } from '@/components/admin/resource-manager';

const fields: FieldDef[] = [
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'textarea', key: 'description', label: 'Description', rows: 3 },
  { type: 'icon', key: 'icon', label: 'Icon' },
  { type: 'number', key: 'order', label: 'Order' },
];

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title' },
  {
    key: 'description',
    label: 'Description',
    render: (row) => (
      <span className="line-clamp-2 text-muted-foreground max-w-md">{String(row.description ?? '')}</span>
    ),
  },
  {
    key: 'icon',
    label: 'Icon',
    render: (row) => <span className="font-mono text-xs">{String(row.icon ?? '')}</span>,
  },
];

export default function AdminWhyPage() {
  return (
    <ResourceManager
      resource="why"
      title="Why Choose Us"
      description="The three feature cards in the “Why Choose Ocean Tune” section of the homepage."
      fields={fields}
      columns={columns}
      defaults={{ title: '', description: '', icon: 'Users', order: 0 }}
    />
  );
}