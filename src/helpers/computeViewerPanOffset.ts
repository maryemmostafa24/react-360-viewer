import type { PanOffset } from './computeViewerImageLayout';

type PanStart = {
    pointerX: number;
    pointerY: number;
    panX: number;
    panY: number;
};

export function computeViewerPanOffset(panStart: PanStart, clientX: number, clientY: number): PanOffset {
    const deltaX = clientX - panStart.pointerX;
    const deltaY = clientY - panStart.pointerY;

    return {
        panX: panStart.panX + deltaX,
        panY: panStart.panY + deltaY,
    };
}
