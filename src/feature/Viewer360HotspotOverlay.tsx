import type { JSX, MouseEvent, ReactNode } from 'react';

import { hotspotToViewer360Marker } from '../helpers/markerHelpers';
import type { Viewer360Hotspot, Viewer360HotspotPinOptions, Viewer360HotspotRenderProps } from '../types';
import { Item } from '@/components/ui/Item';

import { Viewer360MarkerPin } from './Viewer360MarkerPin';

type Viewer360HotspotOverlayProps<TData = unknown> = {
    hotspot: Viewer360Hotspot<TData>;
    leftPercent: number;
    topPercent: number;
    hotspotPin?: Viewer360HotspotPinOptions<TData>;
    renderHotspot?: (props: Viewer360HotspotRenderProps<TData>) => ReactNode;
    onHotspotClick?: (hotspot: Viewer360Hotspot<TData>, event: MouseEvent<HTMLDivElement>) => void;
};

export function Viewer360HotspotOverlay<TData = unknown>({
    hotspot,
    leftPercent,
    topPercent,
    hotspotPin,
    renderHotspot,
    onHotspotClick,
}: Viewer360HotspotOverlayProps<TData>): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    if (renderHotspot) {
        return (
            <Item size="xs" variant="default" className="pointer-events-auto w-auto border-transparent p-0">
                {renderHotspot({ hotspot, leftPercent, topPercent })}
            </Item>
        );
    }

    const marker = hotspotPin?.getMarker?.(hotspot) ?? hotspotToViewer360Marker(hotspot);

    return (
        <Viewer360MarkerPin
            marker={marker}
            hotspot={hotspot}
            leftPercent={leftPercent}
            topPercent={topPercent}
            onDelete={hotspotPin?.onDelete}
            isDeletePending={hotspotPin?.deletingMarkerId === hotspot.id}
            renderTag={hotspotPin?.renderTag}
            classNames={hotspotPin?.classNames}
            labels={hotspotPin?.labels}
            onClick={
                onHotspotClick
                    ? (event) => onHotspotClick(hotspot, event as unknown as MouseEvent<HTMLDivElement>)
                    : undefined
            }
        />
    );
}
