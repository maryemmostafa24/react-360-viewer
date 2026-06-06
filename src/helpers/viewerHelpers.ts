import type { Viewer360Frame } from '../types';

import { computeViewerImageLayout, type PanOffset } from './computeViewerImageLayout';

type DrawFrameOnCanvasParams = {
    canvas: HTMLCanvasElement;
    container: HTMLDivElement;
    image: HTMLImageElement;
    zoom: number;
    pan: PanOffset;
};

export function drawFrameOnCanvas({ canvas, container, image, zoom, pan }: DrawFrameOnCanvasParams): void {
    if (!image.complete || !image.naturalWidth) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const layout = computeViewerImageLayout({
        containerWidth: rect.width,
        containerHeight: rect.height,
        imageWidth: image.naturalWidth,
        imageHeight: image.naturalHeight,
        pan,
    });

    ctx.save();
    ctx.translate(layout.centerX, layout.centerY);
    ctx.scale(zoom, zoom);
    ctx.translate(-layout.centerX, -layout.centerY);
    ctx.drawImage(image, layout.offsetX, layout.offsetY, layout.drawWidth, layout.drawHeight);
    ctx.restore();
}

export function getFramesSignature(frames: Viewer360Frame[]): string {
    return frames.map((frame) => frame.id).join('-');
}

export function preloadFrameImage(frame: Viewer360Frame): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = (): void => resolve(img);
        img.onerror = (): void => reject(new Error(`Failed to load frame: ${frame.src}`));
        img.src = frame.src;
    });
}

export async function preloadViewerFrames(frames: Viewer360Frame[]): Promise<HTMLImageElement[]> {
    const results = await Promise.allSettled(frames.map(preloadFrameImage));

    return results.map((result) => (result.status === 'fulfilled' ? result.value : new Image()));
}

export function hasLoadedViewerFrame(images: HTMLImageElement[]): boolean {
    return images.some((image) => image.complete && image.naturalWidth > 0);
}

export function filterHotspotsByFrame<TData>(
    hotspots: Array<{ frameIndex: number; data?: TData }>,
    frameIndex: number
): Array<{ frameIndex: number; data?: TData }> {
    return hotspots.filter((hotspot) => hotspot.frameIndex === frameIndex);
}
