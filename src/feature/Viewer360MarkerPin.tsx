import type { JSX } from 'react';
import { useState } from 'react';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { cn } from '@/components/utils';

export function Viewer360MarkerPin<TData = unknown>({
    marker,
    hotspot,
    leftPercent,
    topPercent,
    onDelete,
    isDeletePending = false,
    renderTag,
    classNames,
    labels,
}: Viewer360MarkerPinProps<TData>): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: States & Constants
    // ----------------------------------------------------------------------------------------------------
    const [isOpen, setIsOpen] = useState(false);
    const deleteLabel = labels?.delete ?? defaultViewer360MarkerPinLabels.delete;

    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <Item
                size="xs"
                variant="default"
                className={cn(viewer360MarkerPinClassNames.root, classNames?.root, 'w-auto border-transparent p-0')}
                style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <Badge
                    variant="destructive"
                    className={cn(viewer360MarkerPinClassNames.ping, classNames?.ping, 'absolute size-6 border-0 bg-destructive opacity-60')}
                    aria-hidden="true"
                />

                <PopoverTrigger asChild>
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
                    />
                </PopoverTrigger>

                <PopoverContent
                    className={cn(viewer360MarkerPinClassNames.tooltip, classNames?.tooltip, 'w-64 p-0')}
                    side="top"
                    align="center"
                    onOpenAutoFocus={(event) => event.preventDefault()}
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
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onDelete(marker.id);
                                    }}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </ItemActions>
                        )}
                    </Item>
                </PopoverContent>
            </Item>
        </Popover>
    );
}
