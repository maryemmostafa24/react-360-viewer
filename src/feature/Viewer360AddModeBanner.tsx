import type { JSX } from 'react';

import { Badge } from '@/components/ui/Badge';
import { cn } from '@/components/utils';

type Viewer360AddModeBannerProps = {
    className?: string;
    label: string;
};

export function Viewer360AddModeBanner({ className, label }: Viewer360AddModeBannerProps): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    return (
        <Badge variant="outline" className={cn('pointer-events-none', className)}>
            {label}
        </Badge>
    );
}
