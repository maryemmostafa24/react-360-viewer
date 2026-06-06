import type { JSX } from 'react';

import { Loader2Icon } from 'lucide-react';

import { cn } from '@/components/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>): JSX.Element {
    return <Loader2Icon role="status" aria-label="Loading" className={cn('size-4 animate-spin', className)} {...props} />;
}

export { Spinner };
