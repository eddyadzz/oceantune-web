import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
  variant?: 'dark' | 'light';
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md';
};

export function Logo({ variant = 'dark', showText = true, size = 'md', className }: LogoProps) {
  const logoSize = size === 'sm' ? 36 : 40;
  const textSize = size === 'sm' ? 'text-lg' : 'text-xl';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-110">
        <Image
          src="/logo.svg"
          alt="Ocean Tune logo"
          width={logoSize}
          height={logoSize}
          className="rounded-xl"
        />
      </div>
      {showText && (
        <span
          className={cn(
            'font-heading font-bold transition-colors',
            textSize,
            variant === 'dark' ? 'text-primary' : 'text-white'
          )}
        >
          Ocean Tune
        </span>
      )}
    </div>
  );
}
