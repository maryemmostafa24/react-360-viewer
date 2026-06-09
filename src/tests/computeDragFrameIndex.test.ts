import { describe, expect, it } from 'vitest';

import { clampFrameIndex, computeDragFrameIndex } from '../helpers/computeDragFrameIndex';

describe('computeDragFrameIndex', () => {
    it('wraps frame indices', () => {
        expect(clampFrameIndex(-1, 24)).toBe(23);
        expect(clampFrameIndex(24, 24)).toBe(0);
    });

    it('returns null when drag delta is below sensitivity', () => {
        const result = computeDragFrameIndex({ pointerX: 100, frameIndex: 3 }, 104, 24, 8);
        expect(result).toBeNull();
    });

    it('advances frames based on horizontal drag', () => {
        const result = computeDragFrameIndex({ pointerX: 200, frameIndex: 5 }, 120, 24, 8);
        expect(result).toBe(15);
    });
});
