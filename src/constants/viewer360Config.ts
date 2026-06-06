export const viewer360Config = {
    minZoom: 1,
    maxZoom: 3,
    zoomStep: 0.15,
    dragSensitivity: 8,
    autoRotate: false,
    autoRotateIntervalMs: 100,
    autoRotateDirection: 'forward' as const,
};

export const defaultViewer360Config = viewer360Config;
