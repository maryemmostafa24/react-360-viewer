import { describe, expect, it } from 'vitest';

import {
    computeHotspotPositionFromClick,
    computeHotspotScreenPosition,
    computeViewerImageLayout,
} from './computeViewerImageLayout';

describe('computeViewerImageLayout', () => {
    const layout = computeViewerImageLayout({
        containerWidth: 800,
        containerHeight: 500,
        imageWidth: 1600,
        imageHeight: 900,
    });

    it('letterboxes wide images', () => {
        expect(layout.drawWidth).toBe(800);
        expect(layout.drawHeight).toBeCloseTo(450);
        expect(layout.offsetY).toBeCloseTo(25);
    });

    it('maps stored hotspot coordinates to screen space', () => {
        const screen = computeHotspotScreenPosition(50, 50, layout, 1);
        expect(screen.leftPercent).toBeCloseTo(50, 1);
        expect(screen.topPercent).toBeCloseTo(50, 1);
    });

    it('derives hotspot coordinates from click position', () => {
        const rect = {
            left: 0,
            top: 0,
            width: 800,
            height: 500,
            right: 800,
            bottom: 500,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        } as DOMRect;

        const position = computeHotspotPositionFromClick(400, 250, rect, layout, 1);
        expect(position.positionX).toBeGreaterThan(0);
        expect(position.positionY).toBeGreaterThan(0);
        expect(position.positionX).toBeLessThanOrEqual(100);
        expect(position.positionY).toBeLessThanOrEqual(100);
    });
});
