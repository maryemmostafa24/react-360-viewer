import type { Viewer360ClassNames } from '../types/Viewer360Props';
import type { Viewer360MarkerPinClassNames } from '../types/Viewer360Marker';

export const viewer360ClassNames: Required<Viewer360ClassNames> = {
    root: 'overflow-hidden rounded-lg border bg-card text-card-foreground',
    viewport: 'relative aspect-[16/10] w-full touch-none select-none bg-muted',
    canvas: 'absolute inset-0 size-full',
    overlay: 'pointer-events-none absolute inset-0 overflow-hidden',
    loading: 'absolute inset-0 flex items-center justify-center bg-muted/80',
    loadingText: 'text-sm text-muted-foreground',
    frameIndicator:
        'pointer-events-none absolute bottom-4 start-4 z-20 rounded-full border bg-background px-4 py-1.5 text-xs font-medium shadow-sm',
    hotspotModeBanner:
        'pointer-events-none absolute top-4 start-1/2 z-20 -translate-x-1/2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    toolbar: 'flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3',
    dragHint: 'hidden text-xs text-muted-foreground sm:block',
    controls: 'ms-auto flex items-center gap-1.5',
    controlButton: '',
    controlButtonActive: '',
    controlButtonDisabled: '',
    zoomDisplay: 'flex min-w-[3rem] items-center justify-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium',
    divider: 'mx-1 h-6 w-px bg-border',
};

export const viewer360MarkerPinClassNames: Required<Viewer360MarkerPinClassNames> = {
    root: 'pointer-events-auto absolute z-30 -translate-x-1/2 -translate-y-1/2',
    ping: 'absolute inline-flex size-6 -translate-x-1/4 -translate-y-1/4 animate-ping rounded-full bg-destructive opacity-60',
    dot: 'relative flex size-4 items-center justify-center rounded-full border-2 border-background bg-destructive shadow-md transition-transform duration-200 hover:scale-125 focus:outline-none',
    tooltip:
        'absolute bottom-6 left-1/2 z-40 w-64 -translate-x-1/2 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md',
    tooltipHeader: 'flex items-start justify-between gap-2',
    tooltipBody: 'flex min-w-0 flex-col gap-1',
    tooltipTitle: 'text-sm font-medium',
    tooltipDescription: 'mt-2 line-clamp-3 text-xs text-muted-foreground',
    deleteButton: '',
};

/** @deprecated Use `viewer360ClassNames` */
export const defaultViewer360ClassNames = viewer360ClassNames;

/** @deprecated Use `viewer360MarkerPinClassNames` */
export const defaultViewer360MarkerPinClassNames = viewer360MarkerPinClassNames;
