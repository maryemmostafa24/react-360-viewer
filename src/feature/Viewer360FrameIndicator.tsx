import type { JSX } from 'react';

import { Badge } from '@/components/ui/Badge';
import { cn } from '@/components/utils';

type Viewer360FrameIndicatorProps = {
    className?: string;
    label: string;
};

export function Viewer360FrameIndicator({ className, label }: Viewer360FrameIndicatorProps): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    return (
        <Badge variant="outline" className={cn('pointer-events-none shadow-sm', className)}>
            {label}
        </Badge>
    );
}
