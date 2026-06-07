export type Viewer360Frame = {
    id: string;
    src: string;
    label?: string;
};

export type Viewer360PanOffset = {
    panX: number;
    panY: number;
};

export type Viewer360Config = {
    minZoom?: number;
    maxZoom?: number;
    zoomStep?: number;
    dragSensitivity?: number;
    autoRotate?: boolean;
    autoRotateIntervalMs?: number;
    autoRotateDirection?: 'forward' | 'backward';
};

export type Viewer360Hotspot<TData = unknown> = {
    id: string;
    frameIndex: number;
    positionX: number;
    positionY: number;
    data?: TData;
};

export type Viewer360HotspotPosition = {
    frameIndex: number;
    frameId: string;
    positionX: number;
    positionY: number;
};

export type Viewer360HotspotRenderProps<TData = unknown> = {
    hotspot: Viewer360Hotspot<TData>;
    leftPercent: number;
    topPercent: number;
};

export type Viewer360OverlayRenderProps = {
    currentFrameIndex: number;
    frameCount: number;
    frameLabel?: string;
    isHotspotMode: boolean;
    labels: Required<import('./Viewer360Props').Viewer360Labels>;
    frameIndicatorClassName: string;
};

export type Viewer360ToolbarRenderProps = {
    zoom: number;
    minZoom: number;
    maxZoom: number;
    isResetDisabled: boolean;
    isHotspotMode: boolean;
    showHotspotModeControl: boolean;
    showZoomControls: boolean;
    showResetControl: boolean;
    showDragHint: boolean;
    labels: Required<import('./Viewer360Props').Viewer360Labels>;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetView: () => void;
    onHotspotModeChange: (active: boolean) => void;
};
