import type { Viewer360Hotspot, Viewer360Marker } from '../types';

export function hotspotToViewer360Marker<TData>(hotspot: Viewer360Hotspot<TData>): Viewer360Marker {
    const data = hotspot.data;

    if (data && typeof data === 'object' && 'title' in data && typeof (data as { title?: unknown }).title === 'string') {
        const marker = data as unknown as Viewer360Marker;

        return {
            id: marker.id ?? hotspot.id,
            title: marker.title,
            description: marker.description,
        };
    }

    return {
        id: hotspot.id,
        title: hotspot.id,
    };
}

export function toViewer360Hotspots<TData extends Viewer360Marker>(
    markers: Array<Viewer360Marker & { frameIndex: number; positionX: number; positionY: number }>,
    mapData?: (marker: Viewer360Marker & { frameIndex: number; positionX: number; positionY: number }) => TData
): Viewer360Hotspot<TData>[] {
    return markers.map((marker) => ({
        id: marker.id,
        frameIndex: marker.frameIndex,
        positionX: marker.positionX,
        positionY: marker.positionY,
        data: mapData ? mapData(marker) : (marker as unknown as TData),
    }));
}
