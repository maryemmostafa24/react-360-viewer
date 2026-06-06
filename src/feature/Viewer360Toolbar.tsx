import type { JSX } from 'react';

import { Crosshair, Minus, Plus, RotateCcw, ZoomIn } from 'lucide-react';

import { viewer360ClassNames } from '../constants/viewer360ClassNames';
import type { Viewer360ToolbarRenderProps } from '../types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CardFooter } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { cn } from '@/components/utils';

type Viewer360ToolbarProps = Viewer360ToolbarRenderProps;

export function Viewer360Toolbar({
    showDragHint,
    showHotspotModeControl,
    showZoomControls,
    showResetControl,
    labels,
    isHotspotMode,
    zoom,
    minZoom,
    maxZoom,
    isResetDisabled,
    onHotspotModeChange,
    onZoomIn,
    onZoomOut,
    onResetView,
}: Viewer360ToolbarProps): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    return (
        <CardFooter className={cn(viewer360ClassNames.toolbar, 'gap-2 border-t px-4 py-3 pt-3')}>
            {showDragHint && (
                <Label className={cn(viewer360ClassNames.dragHint, 'font-normal text-muted-foreground')}>{labels.dragHint}</Label>
            )}

            <div className={viewer360ClassNames.controls}>
                {showHotspotModeControl && (
                    <>
                        <Button variant={isHotspotMode ? 'default' : 'outline'} size="sm" onClick={() => onHotspotModeChange(!isHotspotMode)}>
                            <Crosshair className="me-1.5 size-4" />
                            {labels.addHotspot}
                        </Button>
                        <Separator orientation="vertical" className={cn(viewer360ClassNames.divider, 'h-6')} />
                    </>
                )}

                {showZoomControls && (
                    <>
                        <Button variant="outline" size="icon-sm" disabled={zoom <= minZoom} aria-label={labels.zoomOut} onClick={onZoomOut}>
                            <Minus className="size-4" />
                        </Button>
                        <Badge variant="outline" className={cn(viewer360ClassNames.zoomDisplay, 'h-8 gap-1 px-2 py-1')}>
                            <ZoomIn className="size-3 text-muted-foreground" />
                            {labels.zoom(Math.round(zoom * 100))}
                        </Badge>
                        <Button variant="outline" size="icon-sm" disabled={zoom >= maxZoom} aria-label={labels.zoomIn} onClick={onZoomIn}>
                            <Plus className="size-4" />
                        </Button>
                    </>
                )}

                {showResetControl && (
                    <Button variant="outline" size="icon-sm" disabled={isResetDisabled} aria-label={labels.resetView} onClick={onResetView}>
                        <RotateCcw className="size-4" />
                    </Button>
                )}
            </div>
        </CardFooter>
    );
}
