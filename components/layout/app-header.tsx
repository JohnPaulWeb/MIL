import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export function AppHeader({ title, subtitle, children, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none">TruthLens</p>
              <p className="text-xs text-muted-foreground">Misinformation Detector</p>
            </div>
          </Link>
          {title && (
            <div className="hidden min-w-0 border-l border-border pl-4 md:block">
              <p className="truncate text-sm font-semibold">{title}</p>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}

export function AppHeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button variant="ghost" size="sm" render={<Link href={href} />}>
      {children}
    </Button>
  );
}
