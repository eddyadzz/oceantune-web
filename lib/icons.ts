import {
  Activity,
  Anchor,
  Camera,
  Cctv,
  Hammer,
  Headset,
  LifeBuoy,
  MonitorSmartphone,
  Network,
  Palette,
  RadioTower,
  Router,
  Satellite,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Activity,
  Anchor,
  Camera,
  Cctv,
  Hammer,
  Headset,
  LifeBuoy,
  MonitorSmartphone,
  Network,
  Palette,
  RadioTower,
  Router,
  Satellite,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
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