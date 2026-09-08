import { cn } from '@/lib/utils';

type PageHeroProps = {
  title: string;
  description?: string;
  breadcrumb?: string;
  className?: string;
};

export function PageHero({ title, description, breadcrumb, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative gradient-ocean-dark text-white overflow-hidden',
        'pt-36 pb-20 sm:pt-40 sm:pb-28',
        className
      )}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-secondary blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="container-wide relative">
        {breadcrumb && (
          <p className="text-sm text-white/50 mb-4 animate-fade-in">
            {breadcrumb}
          </p>
        )}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-balance mb-5 animate-fade-up">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
