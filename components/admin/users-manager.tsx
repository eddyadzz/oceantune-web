'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, ShieldCheck, Shield, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  createdAt: string;
};

export function UsersManager({ currentUserId }: { currentUserId?: string }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '', password: '', role: 'EDITOR' as 'ADMIN' | 'EDITOR' });

  const load = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      toast.error('Could not load users.');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!draft.email.trim() || !draft.password) {
      toast.error('Email and password are required.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Create failed.');
      }
      toast.success('User created.');
      setShowCreate(false);
      setDraft({ name: '', email: '', password: '', role: 'EDITOR' });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Create failed.');
    } finally {
      setCreating(false);
    }
  };

  const setRole = async (u: UserRow, role: 'ADMIN' | 'EDITOR') => {
    try {
      if (u.id === currentUserId && role !== 'ADMIN') {
        toast.error('You cannot demote yourself.');
        return;
      }
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      toast.success('Role updated.');
      load();
    } catch {
      toast.error('Update failed.');
    }
  };

  const resetPassword = async (u: UserRow) => {
    const next = window.prompt(`New password for ${u.email}:`);
    if (!next) return;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: next }),
      });
      if (!res.ok) throw new Error();
      toast.success('Password updated.');
    } catch {
      toast.error('Update failed.');
    }
  };

  const remove = async (u: UserRow) => {
    if (!window.confirm(`Delete user ${u.email}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Delete failed.');
      }
      toast.success('User deleted.');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

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
          <h1 className="font-heading text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage who can sign in to the CMS. Editors maintain content; Admins also manage users.
          </p>
        </div>
        <Button onClick={() => setShowCreate((v) => !v)} disabled={creating}>
          {showCreate ? null : <Plus className="mr-1.5 h-4 w-4" />}
          {showCreate ? 'Cancel' : 'Add member'}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invite new member</CardTitle>
            <CardDescription>They can sign in immediately with these credentials.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs">Name</Label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="jane@oceantune.com" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Password</Label>
              <Input type="text" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} placeholder="temporary password" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Role</Label>
              <Select value={draft.role} onValueChange={(v) => setDraft({ ...draft, role: v as 'ADMIN' | 'EDITOR' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button onClick={create} disabled={creating}>
                {creating && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Create user
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <div key={u.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                    {(u.name ?? u.email)[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">
                      {u.name ?? u.email} {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {u.email} · joined {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {u.role === 'ADMIN' ? <ShieldCheck className="mr-1 h-3 w-3" /> : <Shield className="mr-1 h-3 w-3" />}
                    {u.role === 'ADMIN' ? 'Admin' : 'Editor'}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setRole(u, u.role === 'ADMIN' ? 'EDITOR' : 'ADMIN')}
                    >
                      Make {u.role === 'ADMIN' ? 'editor' : 'admin'}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-9" onClick={() => resetPassword(u)} aria-label="Reset password" disabled={isSelf}>
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-9 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(u)}
                      aria-label="Delete"
                      disabled={isSelf}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}