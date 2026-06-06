import type { ReactNode } from 'react';

import type { Viewer360Hotspot } from './Viewer360Hotspot';

export type Viewer360Marker = {
    id: string;
    title: string;
    description?: string;
};

export type Viewer360MarkerPinClassNames = {
    root?: string;
    ping?: string;
    dot?: string;
    tooltip?: string;
    tooltipHeader?: string;
    tooltipBody?: string;
    tooltipTitle?: string;
    tooltipDescription?: string;
    deleteButton?: string;
};

export type Viewer360MarkerPinLabels = {
    delete?: string;
};

export type Viewer360MarkerPinRenderProps<TData = unknown> = {
    marker: Viewer360Marker;
    hotspot?: Viewer360Hotspot<TData>;
};

export type Viewer360MarkerPinProps<TData = unknown> = {
    marker: Viewer360Marker;
    hotspot?: Viewer360Hotspot<TData>;
    leftPercent: number;
    topPercent: number;
    onDelete?: (id: string) => void;
    isDeletePending?: boolean;
    renderTag?: (props: Viewer360MarkerPinRenderProps<TData>) => ReactNode;
    classNames?: Viewer360MarkerPinClassNames;
    labels?: Viewer360MarkerPinLabels;
};

export type Viewer360HotspotPinOptions<TData = unknown> = {
    onDelete?: (id: string) => void;
    deletingMarkerId?: string | null;
    getMarker?: (hotspot: Viewer360Hotspot<TData>) => Viewer360Marker;
    renderTag?: (props: Viewer360MarkerPinRenderProps<TData>) => ReactNode;
    classNames?: Viewer360MarkerPinClassNames;
    labels?: Viewer360MarkerPinLabels;
};
