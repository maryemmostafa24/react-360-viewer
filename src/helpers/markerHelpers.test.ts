import { describe, expect, it } from 'vitest';

import { hotspotToViewer360Marker, toViewer360Hotspots } from './markerHelpers';

describe('markerHelpers', () => {
    it('maps hotspot data to marker content', () => {
        const marker = hotspotToViewer360Marker({
            id: '1',
            frameIndex: 0,
            positionX: 40,
            positionY: 50,
            data: { id: '1', title: 'Scratch', description: 'Front bumper' },
        });

        expect(marker).toEqual({ id: '1', title: 'Scratch', description: 'Front bumper' });
    });

    it('falls back to hotspot id when data is missing', () => {
        const marker = hotspotToViewer360Marker({
            id: 'marker-2',
            frameIndex: 1,
            positionX: 10,
            positionY: 20,
        });

        expect(marker).toEqual({ id: 'marker-2', title: 'marker-2' });
    });

    it('builds hotspot array from marker records', () => {
        const hotspots = toViewer360Hotspots([
            { id: 'a', frameIndex: 0, positionX: 12, positionY: 34, title: 'Dent' },
        ]);

        expect(hotspots).toHaveLength(1);
        expect(hotspots[0]?.frameIndex).toBe(0);
        expect(hotspots[0]?.positionX).toBe(12);
    });
});
