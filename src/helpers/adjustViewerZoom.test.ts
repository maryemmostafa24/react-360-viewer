import { describe, expect, it } from 'vitest';

import { applyWheelZoom, isResetDisabled, resolveViewer360Config, stepZoomIn, stepZoomOut } from './adjustViewerZoom';

describe('adjustViewerZoom', () => {
    const config = resolveViewer360Config();

    it('clamps wheel zoom within bounds', () => {
        const result = applyWheelZoom(1, -100, { panX: 0, panY: 0 }, config);
        expect(result.zoom).toBeGreaterThan(1);
        expect(result.zoom).toBeLessThanOrEqual(config.maxZoom);
    });

    it('resets pan when zoom returns to minimum', () => {
        const result = applyWheelZoom(1.15, 100, { panX: 12, panY: 8 }, config);
        expect(result.zoom).toBe(config.minZoom);
        expect(result.pan).toEqual({ panX: 0, panY: 0 });
    });

    it('steps zoom in and out', () => {
        expect(stepZoomIn(1, config)).toBeCloseTo(1.15);
        expect(stepZoomOut(1.15, { panX: 4, panY: 2 }, config).zoom).toBeCloseTo(1);
    });

    it('detects reset disabled state', () => {
        expect(isResetDisabled(1, { panX: 0, panY: 0 }, config)).toBe(true);
        expect(isResetDisabled(1.3, { panX: 0, panY: 0 }, config)).toBe(false);
    });
});
