import {
  Anchor,
  Camera,
  Hammer,
  MonitorSmartphone,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Anchor,
  Camera,
  Hammer,
  MonitorSmartphone,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
};

export const iconOptions = Object.keys(iconMap);

export function resolveIcon(name?: string | null): LucideIcon {
  if (name && iconMap[name]) return iconMap[name];
  return Sparkles;
}

export function iconNameOf(icon: LucideIcon): string | undefined {
  return iconOptions.find((key) => iconMap[key] === icon);
}