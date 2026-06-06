import type { PointerEvent as ReactPointerEvent, RefObject, WheelEvent as ReactWheelEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
    applyWheelZoom,
    getViewerCursorClass,
    isResetDisabled,
    resolveViewer360Config,
    stepZoomIn,
    stepZoomOut,
} from '../helpers/adjustViewerZoom';
import { computeDragFrameIndex } from '../helpers/computeDragFrameIndex';
import {
    computeHotspotPositionFromClick,
    computeHotspotScreenPosition,
    computeViewerImageLayout,
    type ViewerImageLayout,
} from '../helpers/computeViewerImageLayout';
import { computeViewerPanOffset } from '../helpers/computeViewerPanOffset';
import {
    drawFrameOnCanvas,
    filterHotspotsByFrame,
    getFramesSignature,
    hasLoadedViewerFrame,
    preloadViewerFrames,
} from '../helpers/viewerHelpers';
import type {
    Viewer360Config,
    Viewer360Frame,
    Viewer360Hotspot,
    Viewer360HotspotPosition,
    Viewer360PanOffset,
} from '../types';

type UseViewer360Params<TData> = {
    frames: Viewer360Frame[];
    currentFrameIndex: number;
    onFrameChange: (index: number) => void;
    hotspots?: Viewer360Hotspot<TData>[];
    config?: Viewer360Config;
    hotspotMode?: boolean;
    onHotspotAdd?: (position: Viewer360HotspotPosition) => void;
};

type UseViewer360Return<TData> = {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    containerRef: RefObject<HTMLDivElement | null>;
    currentFrame: Viewer360Frame | undefined;
    currentFrameHotspots: Viewer360Hotspot<TData>[];
    imagesLoaded: boolean;
    isHotspotMode: boolean;
    isResetDisabled: boolean;
    maxZoom: number;
    minZoom: number;
    viewerCursorClass: string;
    zoom: number;
    getCurrentImageLayout: () => ViewerImageLayout | null;
    getHotspotScreenPosition: (hotspot: Viewer360Hotspot<TData>) => { leftPercent: number; topPercent: number };
    handleCanvasClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    handlePointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
    handlePointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
    handlePointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
    handleResetView: () => void;
    handleWheel: (event: ReactWheelEvent<HTMLDivElement>) => void;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
};

export function useViewer360<TData = unknown>({
    frames,
    hotspots = [],
    currentFrameIndex,
    onFrameChange,
    config,
    hotspotMode: hotspotModeProp = false,
    onHotspotAdd,
}: UseViewer360Params<TData>): UseViewer360Return<TData> {
    const resolvedConfig = useMemo(() => resolveViewer360Config(config), [config]);
    const { minZoom, maxZoom } = resolvedConfig;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const dragStartRef = useRef<{ pointerX: number; frameIndex: number } | null>(null);
    const panStartRef = useRef<{ pointerX: number; pointerY: number; panX: number; panY: number } | null>(null);

    const framesSignature = getFramesSignature(frames);
    const [loadedSignature, setLoadedSignature] = useState<string | null>(null);
    const [zoom, setZoom] = useState<number>(minZoom);
    const [pan, setPan] = useState<Viewer360PanOffset>({ panX: 0, panY: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const isHotspotMode = hotspotModeProp;
    const imagesLoaded = loadedSignature === framesSignature;
    const currentFrameHotspots = filterHotspotsByFrame(hotspots, currentFrameIndex) as Viewer360Hotspot<TData>[];
    const currentFrame = frames[currentFrameIndex];
    const viewerCursorClass = getViewerCursorClass(isHotspotMode, zoom, isDragging, minZoom);
    const resetDisabled = isResetDisabled(zoom, pan, resolvedConfig);

    useEffect(() => {
        let cancelled = false;
        imagesRef.current = [];

        async function loadFrames(): Promise<void> {
            const loadedImages = await preloadViewerFrames(frames);

            if (!cancelled && hasLoadedViewerFrame(loadedImages)) {
                imagesRef.current = loadedImages;
                setLoadedSignature(framesSignature);
            }
        }

        void loadFrames();

        return (): void => {
            cancelled = true;
        };
    }, [frames, framesSignature]);

    useEffect(() => {
        if (!imagesLoaded) return;

        function renderFrame(): void {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            const img = imagesRef.current[currentFrameIndex];

            if (!canvas || !container) return;

            drawFrameOnCanvas({ canvas, container, image: img, zoom, pan });
        }

        renderFrame();
        window.addEventListener('resize', renderFrame);

        return (): void => window.removeEventListener('resize', renderFrame);
    }, [imagesLoaded, currentFrameIndex, zoom, pan]);

    useEffect(() => {
        if (!resolvedConfig.autoRotate || frames.length <= 1 || isDragging || isHotspotMode || zoom > minZoom) {
            return;
        }

        const direction = resolvedConfig.autoRotateDirection === 'backward' ? -1 : 1;
        const interval = window.setInterval(() => {
            onFrameChange((currentFrameIndex + direction + frames.length) % frames.length);
        }, resolvedConfig.autoRotateIntervalMs);

        return (): void => window.clearInterval(interval);
    }, [
        resolvedConfig.autoRotate,
        resolvedConfig.autoRotateDirection,
        resolvedConfig.autoRotateIntervalMs,
        frames.length,
        currentFrameIndex,
        isDragging,
        isHotspotMode,
        zoom,
        minZoom,
        onFrameChange,
    ]);

    function getCurrentImageLayout(): ViewerImageLayout | null {
        const container = containerRef.current;
        const image = imagesRef.current[currentFrameIndex];

        if (!container || !image || !image.complete || !image.naturalWidth) return null;

        const rect = container.getBoundingClientRect();

        return computeViewerImageLayout({
            containerWidth: rect.width,
            containerHeight: rect.height,
            imageWidth: image.naturalWidth,
            imageHeight: image.naturalHeight,
            pan,
        });
    }

    function getHotspotScreenPosition(hotspot: Viewer360Hotspot<TData>): { leftPercent: number; topPercent: number } {
        const layout = getCurrentImageLayout();

        if (!layout) {
            return { leftPercent: hotspot.positionX, topPercent: hotspot.positionY };
        }

        return computeHotspotScreenPosition(hotspot.positionX, hotspot.positionY, layout, zoom);
    }

    function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>): void {
        if (isHotspotMode) return;

        event.currentTarget.setPointerCapture(event.pointerId);

        if (zoom > minZoom) {
            panStartRef.current = { pointerX: event.clientX, pointerY: event.clientY, panX: pan.panX, panY: pan.panY };
        } else {
            dragStartRef.current = { pointerX: event.clientX, frameIndex: currentFrameIndex };
        }

        setIsDragging(true);
    }

    function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>): void {
        if (!isDragging) return;

        if (panStartRef.current && zoom > minZoom) {
            setPan(computeViewerPanOffset(panStartRef.current, event.clientX, event.clientY));
            return;
        }

        if (dragStartRef.current && zoom <= minZoom) {
            const nextFrameIndex = computeDragFrameIndex(
                dragStartRef.current,
                event.clientX,
                frames.length,
                resolvedConfig.dragSensitivity
            );

            if (nextFrameIndex !== null) {
                onFrameChange(nextFrameIndex);
            }
        }
    }

    function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>): void {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        dragStartRef.current = null;
        panStartRef.current = null;
        setIsDragging(false);
    }

    function handleWheel(event: ReactWheelEvent<HTMLDivElement>): void {
        event.preventDefault();
        const { zoom: nextZoom, pan: nextPan } = applyWheelZoom(zoom, event.deltaY, pan, resolvedConfig);
        setZoom(nextZoom);
        setPan(nextPan);
    }

    function handleCanvasClick(event: React.MouseEvent<HTMLDivElement>): void {
        if (!isHotspotMode || isDragging || !onHotspotAdd) return;

        const frame = frames[currentFrameIndex];
        if (!frame) return;

        const layout = getCurrentImageLayout();
        if (!layout) return;

        const { positionX, positionY } = computeHotspotPositionFromClick(
            event.clientX,
            event.clientY,
            event.currentTarget.getBoundingClientRect(),
            layout,
            zoom
        );

        onHotspotAdd({
            frameIndex: currentFrameIndex,
            frameId: frame.id,
            positionX,
            positionY,
        });
    }

    function handleResetView(): void {
        setZoom(minZoom);
        setPan({ panX: 0, panY: 0 });
    }

    function handleZoomIn(): void {
        setZoom(stepZoomIn(zoom, resolvedConfig));
    }

    function handleZoomOut(): void {
        const { zoom: nextZoom, pan: nextPan } = stepZoomOut(zoom, pan, resolvedConfig);
        setZoom(nextZoom);
        setPan(nextPan);
    }

    return {
        canvasRef,
        containerRef,
        currentFrame,
        currentFrameHotspots,
        imagesLoaded,
        isHotspotMode,
        isResetDisabled: resetDisabled,
        maxZoom,
        minZoom,
        viewerCursorClass,
        zoom,
        getCurrentImageLayout,
        getHotspotScreenPosition,
        handleCanvasClick,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleResetView,
        handleWheel,
        handleZoomIn,
        handleZoomOut,
    };
}
