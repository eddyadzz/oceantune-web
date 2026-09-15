'use client';

import { ResourceManager, type FieldDef, type ColumnDef } from '@/components/admin/resource-manager';

const fields: FieldDef[] = [
  { type: 'text', key: 'value', label: 'Value' },
  { type: 'text', key: 'label', label: 'Label' },
  { type: 'number', key: 'order', label: 'Order' },
];

const columns: ColumnDef[] = [
  { key: 'value', label: 'Value' },
  { key: 'label', label: 'Label' },
];

export default function AdminStatsPage() {
  return (
    <ResourceManager
      resource="stats"
      title="About Stats"
      description="The numbered statistics banner on the About page (e.g. “5 Core Services”)."
      fields={fields}
      columns={columns}
      defaults={{ value: '', label: '', order: 0 }}
    />
  );
}