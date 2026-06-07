import type { JSX, MouseEvent } from 'react';

import { Trash2 } from 'lucide-react';

import { defaultViewer360MarkerPinLabels } from '../constants/viewer360MarkerLabels';
import { viewer360MarkerPinClassNames } from '../constants/viewer360ClassNames';
import type { Viewer360MarkerPinProps } from '../types';
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
        <div
            className={cn(viewer360MarkerPinClassNames.root, classNames?.root, 'group/marker')}
            style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
        >
            <div className="relative size-4 shrink-0">
                <span className={cn(viewer360MarkerPinClassNames.ping, classNames?.ping)} aria-hidden="true" />

                <Button
                    type="button"
                    variant="destructive"
                    size="icon-xs"
                    className={cn(viewer360MarkerPinClassNames.dot, classNames?.dot, 'hover:bg-destructive')}
                    aria-label={marker.title}
                    onClick={onClick}
                />
            </div>

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
                            {renderTag && (
                                <div className="mt-1 flex w-fit items-center">{renderTag({ marker, hotspot })}</div>
                            )}
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
        </div>
    );
}
