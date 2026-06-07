import type { JSX, MouseEvent } from 'react';

import { Trash2 } from 'lucide-react';

import { defaultViewer360MarkerPinLabels } from '../constants/viewer360MarkerLabels';
import { viewer360MarkerPinClassNames } from '../constants/viewer360ClassNames';
import type { Viewer360MarkerPinProps } from '../types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/Item';
import { cn } from '@/components/utils';

export function Viewer360MarkerPin<TData = unknown>({
    marker,
    hotspot,
    leftPercent,
    topPercent,
    onDelete,
    isDeletePending = false,
    onClick,
    renderTag,
    classNames,
    labels,
}: Viewer360MarkerPinProps<TData>): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: States & Constants
    // ----------------------------------------------------------------------------------------------------
    const deleteLabel = labels?.delete ?? defaultViewer360MarkerPinLabels.delete;
    const showTooltip = Boolean(marker.title || marker.description || onDelete || renderTag);

    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    return (
        <Item
            size="xs"
            variant="default"
            className={cn(
                viewer360MarkerPinClassNames.root,
                classNames?.root,
                'group/marker w-auto border-transparent p-0'
            )}
            style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
        >
            <Badge
                variant="destructive"
                className={cn(viewer360MarkerPinClassNames.ping, classNames?.ping, 'absolute size-6 border-0 bg-destructive opacity-60')}
                aria-hidden="true"
            />

            <Button
                type="button"
                variant="destructive"
                size="icon-xs"
                className={cn(
                    viewer360MarkerPinClassNames.dot,
                    classNames?.dot,
                    'size-4 min-h-4 min-w-4 rounded-full border-2 border-background bg-destructive p-0 shadow-md hover:scale-125 hover:bg-destructive'
                )}
                aria-label={marker.title}
                onClick={onClick}
            />

            {showTooltip && (
                <div
                    className={cn(
                        viewer360MarkerPinClassNames.tooltip,
                        classNames?.tooltip,
                        'pointer-events-none opacity-0 transition-opacity duration-150 group-hover/marker:pointer-events-auto group-hover/marker:opacity-100 group-focus-within/marker:pointer-events-auto group-focus-within/marker:opacity-100'
                    )}
                >
                    <Item
                        size="sm"
                        variant="default"
                        className={cn(viewer360MarkerPinClassNames.tooltipHeader, classNames?.tooltipHeader, 'w-full border-transparent')}
                    >
                        <ItemContent className={cn(viewer360MarkerPinClassNames.tooltipBody, classNames?.tooltipBody)}>
                            <ItemTitle className={cn(viewer360MarkerPinClassNames.tooltipTitle, classNames?.tooltipTitle)}>
                                {marker.title}
                            </ItemTitle>
                            {renderTag?.({ marker, hotspot })}
                            {marker.description && (
                                <ItemDescription className={cn(viewer360MarkerPinClassNames.tooltipDescription, classNames?.tooltipDescription)}>
                                    {marker.description}
                                </ItemDescription>
                            )}
                        </ItemContent>
                        {onDelete && (
                            <ItemActions>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className={classNames?.deleteButton}
                                    disabled={isDeletePending}
                                    aria-label={deleteLabel}
                                    onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                        event.stopPropagation();
                                        onDelete(marker.id);
                                    }}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </ItemActions>
                        )}
                    </Item>
                </div>
            )}
        </Item>
    );
}
