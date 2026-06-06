import type { Viewer360Config } from '../types';

import type { PanOffset } from './computeViewerImageLayout';

type ResolvedViewer360Config = Required<Viewer360Config>;

export function resolveViewer360Config(config?: Viewer360Config): ResolvedViewer360Config {
    return {
        minZoom: config?.minZoom ?? 1,
        maxZoom: config?.maxZoom ?? 3,
        zoomStep: config?.zoomStep ?? 0.15,
        dragSensitivity: config?.dragSensitivity ?? 8,
        autoRotate: config?.autoRotate ?? false,
        autoRotateIntervalMs: config?.autoRotateIntervalMs ?? 100,
        autoRotateDirection: config?.autoRotateDirection ?? 'forward',
    };
}

export function clampZoom(zoom: number, config: ResolvedViewer360Config): number {
    return Math.min(config.maxZoom, Math.max(config.minZoom, zoom));
}

export function applyWheelZoom(
    currentZoom: number,
    deltaY: number,
    currentPan: PanOffset,
    config: ResolvedViewer360Config
): { zoom: number; pan: PanOffset } {
    const delta = deltaY > 0 ? -config.zoomStep : config.zoomStep;
    const zoom = clampZoom(currentZoom + delta, config);

    return {
        zoom,
        pan: zoom === config.minZoom ? { panX: 0, panY: 0 } : currentPan,
    };
}

export function stepZoomIn(currentZoom: number, config: ResolvedViewer360Config): number {
    return clampZoom(currentZoom + config.zoomStep, config);
}

export function stepZoomOut(
    currentZoom: number,
    currentPan: PanOffset,
    config: ResolvedViewer360Config
): { zoom: number; pan: PanOffset } {
    const zoom = clampZoom(currentZoom - config.zoomStep, config);

    return {
        zoom,
        pan: zoom === config.minZoom ? { panX: 0, panY: 0 } : currentPan,
    };
}

export function isResetDisabled(zoom: number, pan: PanOffset, config: ResolvedViewer360Config): boolean {
    return zoom === config.minZoom && pan.panX === 0 && pan.panY === 0;
}

export function getViewerCursorClass(isHotspotMode: boolean, zoom: number, isDragging: boolean, minZoom: number): string {
    if (isHotspotMode) return 'cursor-crosshair';
    if (isDragging) return 'cursor-grabbing';
    if (zoom > minZoom) return 'cursor-grab';
    return 'cursor-ew-resize';
}
