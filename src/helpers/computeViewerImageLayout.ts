export type ViewerImageLayout = {
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    drawWidth: number;
    drawHeight: number;
    offsetX: number;
    offsetY: number;
};

export type PanOffset = {
    panX: number;
    panY: number;
};

type ComputeViewerImageLayoutParams = {
    containerWidth: number;
    containerHeight: number;
    imageWidth: number;
    imageHeight: number;
    pan?: PanOffset;
};

export function computeViewerImageLayout({
    containerWidth,
    containerHeight,
    imageWidth,
    imageHeight,
    pan = { panX: 0, panY: 0 },
}: ComputeViewerImageLayoutParams): ViewerImageLayout {
    const imgAspect = imageWidth / imageHeight;
    const containerAspect = containerWidth / containerHeight;

    let drawWidth: number;
    let drawHeight: number;

    if (imgAspect > containerAspect) {
        drawWidth = containerWidth;
        drawHeight = containerWidth / imgAspect;
    } else {
        drawHeight = containerHeight;
        drawWidth = containerHeight * imgAspect;
    }

    const offsetX = (containerWidth - drawWidth) / 2 + pan.panX;
    const offsetY = (containerHeight - drawHeight) / 2 + pan.panY;

    return {
        width: containerWidth,
        height: containerHeight,
        centerX: containerWidth / 2,
        centerY: containerHeight / 2,
        drawWidth,
        drawHeight,
        offsetX,
        offsetY,
    };
}

export function computeHotspotScreenPosition(
    hotspotX: number,
    hotspotY: number,
    layout: ViewerImageLayout,
    zoom: number
): { leftPercent: number; topPercent: number } {
    const baseOffsetX = (layout.width - layout.drawWidth) / 2;
    const baseOffsetY = (layout.height - layout.drawHeight) / 2;

    const containerX = (hotspotX / 100) * layout.width;
    const containerY = (hotspotY / 100) * layout.height;

    const imageLocalX = (containerX - baseOffsetX) / layout.drawWidth;
    const imageLocalY = (containerY - baseOffsetY) / layout.drawHeight;

    const imagePointX = layout.offsetX + imageLocalX * layout.drawWidth;
    const imagePointY = layout.offsetY + imageLocalY * layout.drawHeight;

    const screenX = layout.centerX + zoom * (imagePointX - layout.centerX);
    const screenY = layout.centerY + zoom * (imagePointY - layout.centerY);

    return {
        leftPercent: (screenX / layout.width) * 100,
        topPercent: (screenY / layout.height) * 100,
    };
}

export function computeHotspotPositionFromClick(
    clientX: number,
    clientY: number,
    containerRect: DOMRect,
    layout: ViewerImageLayout,
    zoom: number
): { positionX: number; positionY: number } {
    const clickX = clientX - containerRect.left;
    const clickY = clientY - containerRect.top;

    const unzoomedX = layout.centerX + (clickX - layout.centerX) / zoom;
    const unzoomedY = layout.centerY + (clickY - layout.centerY) / zoom;

    const baseOffsetX = (layout.width - layout.drawWidth) / 2;
    const baseOffsetY = (layout.height - layout.drawHeight) / 2;

    const imageLocalX = Math.min(1, Math.max(0, (unzoomedX - layout.offsetX) / layout.drawWidth));
    const imageLocalY = Math.min(1, Math.max(0, (unzoomedY - layout.offsetY) / layout.drawHeight));

    const storedX = baseOffsetX + imageLocalX * layout.drawWidth;
    const storedY = baseOffsetY + imageLocalY * layout.drawHeight;

    return {
        positionX: Math.min(100, Math.max(0, (storedX / layout.width) * 100)),
        positionY: Math.min(100, Math.max(0, (storedY / layout.height) * 100)),
    };
}
