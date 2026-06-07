import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { buildViewer360ThemeStyle, mergeViewer360ClassNames, mergeViewer360Labels } from '../helpers/viewer360PropsHelpers';
import { useViewer360 } from '../hooks/useViewer360';
import type { Viewer360OverlayRenderProps, Viewer360Props, Viewer360ToolbarRenderProps } from '../types';
import { Card } from '@/components/ui/Card';
import { cn } from '@/components/utils';

import { Viewer360AddModeBanner } from './Viewer360AddModeBanner';
import { Viewer360FrameIndicator } from './Viewer360FrameIndicator';
import { Viewer360HotspotOverlay } from './Viewer360HotspotOverlay';
import { Viewer360LoadingOverlay } from './Viewer360LoadingOverlay';
import { Viewer360Toolbar } from './Viewer360Toolbar';

export function Viewer360<TData = unknown>({
    frames,
    currentFrameIndex: controlledFrameIndex,
    defaultFrameIndex = 0,
    onFrameChange,
    config,
    className,
    classNames,
    style,
    theme,
    labels,
    aspectRatio = '16 / 10',
    showZoomControls = true,
    showResetControl = true,
    showFrameIndicator = true,
    showDragHint = true,
    showHotspotModeControl = false,
    hotspotPin,
    hotspots = [],
    renderHotspot,
    renderLoading,
    renderFrameIndicator,
    renderHotspotModeBanner,
    renderToolbar,
    onHotspotClick,
    hotspotMode: controlledHotspotMode,
    defaultHotspotMode = false,
    onHotspotModeChange,
    onHotspotAdd,
    children,
}: Viewer360Props<TData>): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: States & Constants
    // ----------------------------------------------------------------------------------------------------
    const mergedLabels = useMemo(() => mergeViewer360Labels(labels), [labels]);
    const mergedClassNames = useMemo(() => mergeViewer360ClassNames(classNames), [classNames]);
    const themeStyle = useMemo(() => buildViewer360ThemeStyle(theme), [theme]);

    const [internalFrameIndex, setInternalFrameIndex] = useState(defaultFrameIndex);
    const [internalHotspotMode, setInternalHotspotMode] = useState(defaultHotspotMode);

    const currentFrameIndex = controlledFrameIndex ?? internalFrameIndex;
    const hotspotMode = controlledHotspotMode ?? internalHotspotMode;

    // ----------------------------------------------------------------------------------------------------
    // MARK: Functions
    // ----------------------------------------------------------------------------------------------------
    function handleFrameChange(index: number): void {
        if (controlledFrameIndex === undefined) {
            setInternalFrameIndex(index);
        }

        onFrameChange?.(index);
    }

    function handleHotspotModeChange(active: boolean): void {
        if (controlledHotspotMode === undefined) {
            setInternalHotspotMode(active);
        }

        onHotspotModeChange?.(active);
    }

    const {
        canvasRef,
        containerRef,
        currentFrame,
        currentFrameHotspots,
        imagesLoaded,
        isHotspotMode,
        isResetDisabled,
        maxZoom,
        minZoom,
        viewerCursorClass,
        zoom,
        getHotspotScreenPosition,
        handleCanvasClick,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleWheel,
        handleResetView,
        handleZoomIn,
        handleZoomOut,
    } = useViewer360<TData>({
        frames,
        hotspots,
        currentFrameIndex,
        onFrameChange: handleFrameChange,
        config,
        hotspotMode,
        onHotspotAdd,
    });

    useEffect(() => {
        if (controlledHotspotMode === undefined) return;
        if (controlledHotspotMode !== internalHotspotMode) {
            setInternalHotspotMode(controlledHotspotMode);
        }
    }, [controlledHotspotMode, internalHotspotMode]);

    const frameLabel = currentFrame?.label ?? frames[currentFrameIndex]?.label;
    const overlayProps: Viewer360OverlayRenderProps = {
        currentFrameIndex,
        frameCount: frames.length,
        frameLabel,
        isHotspotMode,
        labels: mergedLabels,
        frameIndicatorClassName: mergedClassNames.frameIndicator,
    };
    const toolbarProps: Viewer360ToolbarRenderProps = {
        zoom,
        minZoom,
        maxZoom,
        isResetDisabled,
        isHotspotMode,
        showHotspotModeControl,
        showZoomControls,
        showResetControl,
        showDragHint,
        labels: mergedLabels,
        onZoomIn: handleZoomIn,
        onZoomOut: handleZoomOut,
        onResetView: handleResetView,
        onHotspotModeChange: handleHotspotModeChange,
    };
    const showDefaultToolbar = showZoomControls || showResetControl || showHotspotModeControl || showDragHint;

    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    return (
        <Card
            data-viewer-360=""
            className={cn(mergedClassNames.root, 'gap-0 py-0 shadow-none ring-0', className)}
            style={{ ...themeStyle, ...style }}
        >
            <div
                ref={containerRef}
                className={cn(mergedClassNames.viewport, viewerCursorClass)}
                style={{ aspectRatio }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onWheel={handleWheel}
                onClick={handleCanvasClick}
            >
                <canvas ref={canvasRef} className={mergedClassNames.canvas} />

                <div className={mergedClassNames.overlay}>
                    {currentFrameHotspots.map((hotspot) => {
                        const position = getHotspotScreenPosition(hotspot);

                        return (
                            <Viewer360HotspotOverlay
                                key={hotspot.id}
                                hotspot={hotspot}
                                leftPercent={position.leftPercent}
                                topPercent={position.topPercent}
                                hotspotPin={hotspotPin}
                                renderHotspot={renderHotspot}
                                onHotspotClick={onHotspotClick}
                            />
                        );
                    })}
                    {children}
                </div>

                {!imagesLoaded &&
                    (renderLoading ? (
                        renderLoading()
                    ) : (
                        <Viewer360LoadingOverlay
                            className={mergedClassNames.loading}
                            textClassName={mergedClassNames.loadingText}
                            label={mergedLabels.loading}
                        />
                    ))}

                {showFrameIndicator &&
                    frames.length > 0 &&
                    (renderFrameIndicator ? (
                        renderFrameIndicator(overlayProps)
                    ) : (
                        <Viewer360FrameIndicator
                            className={mergedClassNames.frameIndicator}
                            label={mergedLabels.frameIndicator({
                                current: currentFrameIndex + 1,
                                total: frames.length,
                                label: frameLabel,
                            })}
                        />
                    ))}

                {isHotspotMode &&
                    onHotspotAdd &&
                    (renderHotspotModeBanner ? (
                        renderHotspotModeBanner({ labels: mergedLabels })
                    ) : (
                        <Viewer360AddModeBanner className={mergedClassNames.hotspotModeBanner} label={mergedLabels.hotspotModeActive} />
                    ))}
            </div>

            {renderToolbar ? renderToolbar(toolbarProps) : showDefaultToolbar ? <Viewer360Toolbar {...toolbarProps} /> : null}
        </Card>
    );
}
