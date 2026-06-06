import type { JSX } from 'react';

import { Item } from '@/components/ui/Item';
import { Label } from '@/components/ui/Label';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/components/utils';

type Viewer360LoadingOverlayProps = {
    className?: string;
    textClassName?: string;
    label: string;
};

export function Viewer360LoadingOverlay({ className, textClassName, label }: Viewer360LoadingOverlayProps): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    return (
        <Item
            size="sm"
            variant="muted"
            className={cn('pointer-events-none w-auto justify-center border-transparent bg-muted/80', className)}
        >
            <Spinner className="size-5 text-muted-foreground" />
            <Label className={cn('font-normal text-muted-foreground', textClassName)}>{label}</Label>
        </Item>
    );
}
