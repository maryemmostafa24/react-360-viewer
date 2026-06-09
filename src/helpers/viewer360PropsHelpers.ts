import type { CSSProperties } from 'react';

import { defaultViewer360Labels } from '../constants/viewer360Labels';
import { defaultViewer360MarkerPinLabels } from '../constants/viewer360MarkerLabels';
import { viewer360ClassNames } from '../constants/viewer360ClassNames';
import type { Viewer360ClassNames, Viewer360Labels, Viewer360MarkerPinLabels, Viewer360Theme } from '../types';
import { cn } from '@/components/utils';

export function mergeViewer360Labels(labels?: Viewer360Labels): Required<Viewer360Labels> {
    return {
        loading: labels?.loading ?? defaultViewer360Labels.loading,
        dragHint: labels?.dragHint ?? defaultViewer360Labels.dragHint,
        frameIndicator: labels?.frameIndicator ?? defaultViewer360Labels.frameIndicator,
        zoom: labels?.zoom ?? defaultViewer360Labels.zoom,
        hotspotModeActive: labels?.hotspotModeActive ?? defaultViewer360Labels.hotspotModeActive,
        addHotspot: labels?.addHotspot ?? defaultViewer360Labels.addHotspot,
        zoomIn: labels?.zoomIn ?? defaultViewer360Labels.zoomIn,
        zoomOut: labels?.zoomOut ?? defaultViewer360Labels.zoomOut,
        resetView: labels?.resetView ?? defaultViewer360Labels.resetView,
        deleteMarker: labels?.deleteMarker ?? defaultViewer360Labels.deleteMarker,
    };
}

export function mergeViewer360MarkerPinLabels(
    pinLabels?: Viewer360MarkerPinLabels,
    deleteMarker?: string,
): Required<Viewer360MarkerPinLabels> {
    return {
        delete: pinLabels?.delete ?? deleteMarker ?? defaultViewer360MarkerPinLabels.delete,
    };
}

export function mergeViewer360ClassNames(classNames?: Viewer360ClassNames): Required<Viewer360ClassNames> {
    return {
        root: cn(viewer360ClassNames.root, classNames?.root),
        viewport: cn(viewer360ClassNames.viewport, classNames?.viewport),
        canvas: cn(viewer360ClassNames.canvas, classNames?.canvas),
        overlay: cn(viewer360ClassNames.overlay, classNames?.overlay),
        loading: cn(viewer360ClassNames.loading, classNames?.loading),
        loadingText: cn(viewer360ClassNames.loadingText, classNames?.loadingText),
        frameIndicator: cn(viewer360ClassNames.frameIndicator, classNames?.frameIndicator),
        hotspotModeBanner: cn(viewer360ClassNames.hotspotModeBanner, classNames?.hotspotModeBanner),
        toolbar: cn(viewer360ClassNames.toolbar, classNames?.toolbar),
        dragHint: cn(viewer360ClassNames.dragHint, classNames?.dragHint),
        controls: cn(viewer360ClassNames.controls, classNames?.controls),
        controlButton: cn(viewer360ClassNames.controlButton, classNames?.controlButton),
        controlButtonActive: cn(viewer360ClassNames.controlButtonActive, classNames?.controlButtonActive),
        controlButtonDisabled: cn(viewer360ClassNames.controlButtonDisabled, classNames?.controlButtonDisabled),
        zoomDisplay: cn(viewer360ClassNames.zoomDisplay, classNames?.zoomDisplay),
        divider: cn(viewer360ClassNames.divider, classNames?.divider),
    };
}

export function buildViewer360ThemeStyle(theme?: Viewer360Theme): CSSProperties {
    return theme ? (theme as CSSProperties) : {};
}
