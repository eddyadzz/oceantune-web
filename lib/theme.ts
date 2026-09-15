// Theme presets + runtime CSS-variable builder. Client-safe (no server imports).

export type ThemePreset = { label: string; primary: string; secondary: string };

export const themePresets: ThemePreset[] = [
  { label: 'Ocean (default)', primary: '#0A335C', secondary: '#1DA5A5' },
  { label: 'Deep Sea', primary: '#0B3C5D', secondary: '#3AAFA9' },
  { label: 'Emerald', primary: '#14532D', secondary: '#10B981' },
  { label: 'Sunset', primary: '#9A3412', secondary: '#F59E0B' },
  { label: 'Royal', primary: '#3730A3', secondary: '#6D28D9' },
  { label: 'Midnight', primary: '#111827', secondary: '#2563EB' },
];

export function isHexColor(value: string): boolean {
  return /^#?[0-9a-f]{6}$/i.test(value.trim());
}

export function hexToHslTriplet(hex: string): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const light = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return `0 0% ${Math.round(light * 100)}%`;
  const sat = delta / (1 - Math.abs(2 * light - 1));
  let hue: number;
  if (max === rn) hue = ((gn - bn) / delta) % 6;
  else if (max === gn) hue = (bn - rn) / delta + 2;
  else hue = (rn - gn) / delta + 4;
  hue *= 60;
  if (hue < 0) hue += 360;
  return `${Math.round(hue)} ${Math.round(sat * 100)}% ${Math.round(light * 100)}%`;
}

/** Builds a `:root{...}` CSS string overriding the site's semantic colors. */
export function themeCss(settings: Record<string, string>): string {
  const primary = hexToHslTriplet(settings['theme.primary'] ?? '');
  const secondary = hexToHslTriplet(settings['theme.secondary'] ?? '');
  const vars: string[] = [];
  if (primary) vars.push(`--primary: ${primary}`, `--ring: ${primary}`);
  if (secondary) vars.push(`--secondary: ${secondary}`);
  if (vars.length === 0) return '';
  return `:root{${vars.join(';')};}`;
}