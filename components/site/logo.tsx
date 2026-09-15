import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
  variant?: 'dark' | 'light';
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md';
  image?: string;
  name?: string;
};

export function Logo({
  variant = 'dark',
  showText = true,
  size = 'md',
  className,
  image,
  name,
}: LogoProps) {
  const logoSize = size === 'sm' ? 36 : 40;
  const textSize = size === 'sm' ? 'text-lg' : 'text-xl';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {image ? (
        // Brandable logo uploaded from the CMS.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name ?? 'Logo'}
          style={{ height: logoSize, width: 'auto' }}
          className="shrink-0 object-contain"
        />
      ) : (
        <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-110">
          <Image
            src="/logo.svg"
            alt={name ?? 'Logo'}
            width={logoSize}
            height={logoSize}
            className="rounded-xl"
          />
        </div>
      )}
      {showText && (
        <span
          className={cn(
            'font-heading font-bold transition-colors',
            textSize,
            variant === 'dark' ? 'text-primary' : 'text-white'
          )}
        >
          {name ?? 'Ocean Tune'}
        </span>
      )}
    </div>
  );
}