import type { Viewer360Labels } from '../types/Viewer360Props';

export const defaultViewer360Labels: Required<Viewer360Labels> = {
    loading: 'Loading images…',
    dragHint: 'Drag to rotate • Scroll to zoom',
    frameIndicator: ({ current, total, label }) => (label ? `${label} · ${current} / ${total}` : `${current} / ${total}`),
    zoom: (percent) => `${percent}%`,
    hotspotModeActive: 'Click on the image to place a hotspot',
    addHotspot: 'Add hotspot',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetView: 'Reset view',
    deleteMarker: 'Remove marker',
};
