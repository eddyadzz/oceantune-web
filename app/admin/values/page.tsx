'use client';

import { ResourceManager, type FieldDef, type ColumnDef } from '@/components/admin/resource-manager';

const fields: FieldDef[] = [
  { type: 'text', key: 'title', label: 'Title' },
  { type: 'textarea', key: 'description', label: 'Description', rows: 4 },
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

export default function AdminValuesPage() {
  return (
    <ResourceManager
      resource="values"
      title="Company Values"
      description="The values grid on the About page."
      fields={fields}
      columns={columns}
      defaults={{ title: '', description: '', icon: 'ShieldCheck', order: 0 }}
    />
  );
}