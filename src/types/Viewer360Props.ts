import type { CSSProperties, MouseEvent, ReactNode } from 'react';

import type {
    Viewer360Hotspot,
    Viewer360HotspotPosition,
    Viewer360HotspotRenderProps,
    Viewer360OverlayRenderProps,
    Viewer360ToolbarRenderProps,
} from './Viewer360Hotspot';
import type { Viewer360HotspotPinOptions } from './Viewer360Marker';

export type Viewer360ClassNames = {
    root?: string;
    viewport?: string;
    canvas?: string;
    overlay?: string;
    loading?: string;
    loadingText?: string;
    frameIndicator?: string;
    hotspotModeBanner?: string;
    toolbar?: string;
    dragHint?: string;
    controls?: string;
    controlButton?: string;
    controlButtonActive?: string;
    controlButtonDisabled?: string;
    zoomDisplay?: string;
    divider?: string;
};

export type Viewer360Labels = {
    loading?: string;
    dragHint?: string;
    frameIndicator?: (params: { current: number; total: number; label?: string }) => string;
    zoom?: (percent: number) => string;
    hotspotModeActive?: string;
    addHotspot?: string;
    zoomIn?: string;
    zoomOut?: string;
    resetView?: string;
    deleteMarker?: string;
};

export type Viewer360Theme = {
    '--viewer-bg'?: string;
    '--viewer-border'?: string;
    '--viewer-text'?: string;
    '--viewer-muted'?: string;
    '--viewer-accent'?: string;
    '--viewer-accent-foreground'?: string;
    '--viewer-control-bg'?: string;
    '--viewer-control-border'?: string;
    '--viewer-hotspot-banner-bg'?: string;
    '--viewer-hotspot-banner-border'?: string;
    '--viewer-hotspot-banner-text'?: string;
};

export type Viewer360Props<TData = unknown> = {
    frames: import('./Viewer360Hotspot').Viewer360Frame[];
    currentFrameIndex?: number;
    defaultFrameIndex?: number;
    onFrameChange?: (index: number) => void;
    config?: import('./Viewer360Hotspot').Viewer360Config;
    className?: string;
    classNames?: Viewer360ClassNames;
    style?: CSSProperties;
    theme?: Viewer360Theme;
    labels?: Viewer360Labels;
    aspectRatio?: string;
    showZoomControls?: boolean;
    showResetControl?: boolean;
    showFrameIndicator?: boolean;
    showDragHint?: boolean;
    showHotspotModeControl?: boolean;
    hotspotPin?: Viewer360HotspotPinOptions<TData>;
    hotspots?: Viewer360Hotspot<TData>[];
    renderHotspot?: (props: Viewer360HotspotRenderProps<TData>) => ReactNode;
    renderLoading?: () => ReactNode;
    renderFrameIndicator?: (props: Viewer360OverlayRenderProps) => ReactNode;
    renderHotspotModeBanner?: (props: Pick<Viewer360OverlayRenderProps, 'labels'>) => ReactNode;
    renderToolbar?: (props: Viewer360ToolbarRenderProps) => ReactNode;
    onHotspotClick?: (hotspot: Viewer360Hotspot<TData>, event: MouseEvent<HTMLDivElement>) => void;
    hotspotMode?: boolean;
    defaultHotspotMode?: boolean;
    onHotspotModeChange?: (active: boolean) => void;
    onHotspotAdd?: (position: Viewer360HotspotPosition) => void;
    children?: ReactNode;
};

export type {
    Viewer360Hotspot,
    Viewer360HotspotPosition,
    Viewer360HotspotRenderProps,
    Viewer360OverlayRenderProps,
    Viewer360ToolbarRenderProps,
    Viewer360Config,
    Viewer360Frame,
    Viewer360PanOffset,
} from './Viewer360Hotspot';

export type {
    Viewer360HotspotPinOptions,
    Viewer360Marker,
    Viewer360MarkerPinClassNames,
    Viewer360MarkerPinLabels,
    Viewer360MarkerPinProps,
    Viewer360MarkerPinRenderProps,
} from './Viewer360Marker';
