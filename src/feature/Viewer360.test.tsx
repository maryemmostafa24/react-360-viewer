import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Viewer360 } from './Viewer360';
import type { Viewer360Frame } from '../types';

const frames: Viewer360Frame[] = [
    { id: '1', src: 'https://example.com/1.jpg', label: 'Front' },
    { id: '2', src: 'https://example.com/2.jpg', label: 'Side' },
];

describe('Viewer360', () => {
    it('renders loading state and toolbar labels', () => {
        render(
            <Viewer360
                frames={frames}
                labels={{
                    loading: 'Loading test frames',
                    dragHint: 'Drag test hint',
                }}
            />
        );

        expect(screen.getByText('Loading test frames')).toBeInTheDocument();
        expect(screen.getByText('Drag test hint')).toBeInTheDocument();
    });

    it('calls onFrameChange from auto-rotate when enabled', () => {
        vi.useFakeTimers();

        const onFrameChange = vi.fn();

        render(
            <Viewer360
                frames={frames}
                currentFrameIndex={0}
                onFrameChange={onFrameChange}
                config={{ autoRotate: true, autoRotateIntervalMs: 50 }}
            />
        );

        vi.advanceTimersByTime(60);
        expect(onFrameChange).toHaveBeenCalledWith(1);

        vi.useRealTimers();
    });
});
