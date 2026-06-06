export function clampFrameIndex(index: number, frameCount: number): number {
    if (frameCount === 0) return 0;
    return ((index % frameCount) + frameCount) % frameCount;
}

type DragStart = {
    pointerX: number;
    frameIndex: number;
};

export function computeDragFrameIndex(
    dragStart: DragStart,
    clientX: number,
    frameCount: number,
    dragSensitivity: number
): number | null {
    const deltaX = clientX - dragStart.pointerX;
    const frameDelta = Math.round(-deltaX / dragSensitivity);

    if (frameDelta === 0) return null;

    return clampFrameIndex(dragStart.frameIndex + frameDelta, frameCount);
}
