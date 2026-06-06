# @mmmmzxe/react-360-viewer

A standalone, configurable 360° image viewer for React. Drag to rotate through frames, scroll or use controls to zoom, optionally auto-rotate, and place interactive hotspots on any frame.

## Features

- Drag-to-rotate frame navigation
- Zoom via scroll wheel or toolbar controls
- Pan when zoomed in
- Optional auto-rotate
- Hotspot support with built-in marker pins
- shadcn-style UI with Tailwind CSS design tokens
- TypeScript-first API
- Peer dependencies: React, lucide-react, and a Tailwind setup in the host app

## Installation

```bash
npm install @mmmmzxe/react-360-viewer
# or
bun add @mmmmzxe/react-360-viewer
```

Peer dependencies: `react`, `react-dom` (v18+), and `lucide-react`.

### Tailwind setup

The package uses Tailwind utility classes with shadcn design tokens (`bg-card`, `border-border`, `text-muted-foreground`, etc.). Add the package source to your Tailwind CSS entry so those classes are generated:

```css
@source "../node_modules/@mmmmzxe/react-360-viewer/src/**/*.{ts,tsx}";
```

Your host app should also define the standard shadcn CSS variables (`--background`, `--foreground`, `--primary`, `--border`, `--muted-foreground`, and related tokens) in your global stylesheet.

## Quick start

```tsx
import { useState } from 'react';
import { Viewer360, type Viewer360Frame } from '@mmmmzxe/react-360-viewer';

const frames: Viewer360Frame[] = [
  { id: '1', src: '/images/frame-01.jpg', label: 'Front' },
  { id: '2', src: '/images/frame-02.jpg', label: 'Front-right' },
  // ...
];

export function ProductViewer() {
  const [frameIndex, setFrameIndex] = useState(0);

  return (
    <Viewer360
      frames={frames}
      currentFrameIndex={frameIndex}
      onFrameChange={setFrameIndex}
      config={{ dragSensitivity: 8, autoRotate: false }}
    />
  );
}
```

## Hotspots & markers

Hotspots are percentage-based positions (`positionX`, `positionY` from 0–100) tied to a specific frame.

### Built-in marker pins

Use `hotspotPin` for tooltip pins with optional delete — no custom UI required:

```tsx
import { Viewer360, toViewer360Hotspots } from '@mmmmzxe/react-360-viewer';

const hotspots = toViewer360Hotspots([
  { id: '1', frameIndex: 0, positionX: 42, positionY: 58, title: 'Scratch', description: 'Front bumper' },
]);

<Viewer360
  frames={frames}
  hotspots={hotspots}
  showHotspotModeControl
  hotspotPin={{
    onDelete: (id) => removeMarker(id),
    deletingMarkerId: pendingDeleteId,
  }}
  onHotspotAdd={(position) => saveMarker(position)}
/>
```

Use `renderTag` inside `hotspotPin` for badges (e.g. damage type). Use `renderHotspot` only when you need fully custom marker UI.

### Custom hotspot UI

```tsx
import { Viewer360, type Viewer360Hotspot } from '@mmmmzxe/react-360-viewer';

type DamageHotspot = { title: string; severity: 'low' | 'high' };

const hotspots: Viewer360Hotspot<DamageHotspot>[] = [
  { id: 'a', frameIndex: 0, positionX: 42, positionY: 58, data: { title: 'Scratch', severity: 'low' } },
];

<Viewer360
  frames={frames}
  hotspots={hotspots}
  showHotspotModeControl
  onHotspotAdd={(position) => {
    // position: { frameIndex, frameId, positionX, positionY }
    console.log('Place hotspot at', position);
  }}
  renderHotspot={({ hotspot, leftPercent, topPercent }) => (
    <button
      style={{ position: 'absolute', left: `${leftPercent}%`, top: `${topPercent}%` }}
      onClick={() => alert(hotspot.data?.title)}
    />
  )}
/>
```

When hotspot add mode is active, clicking the viewport calls `onHotspotAdd` with normalized coordinates that stay aligned while zooming or panning.

## Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `frames` | `Viewer360Frame[]` | required | Image sources |
| `config.minZoom` | `number` | `1` | Minimum zoom level |
| `config.maxZoom` | `number` | `3` | Maximum zoom level |
| `config.zoomStep` | `number` | `0.15` | Zoom increment |
| `config.dragSensitivity` | `number` | `8` | Pixels per frame while dragging |
| `config.autoRotate` | `boolean` | `false` | Enable automatic rotation |
| `config.autoRotateIntervalMs` | `number` | `100` | Delay between auto-rotate steps |
| `config.autoRotateDirection` | `'forward' \| 'backward'` | `'forward'` | Auto-rotate direction |
| `showZoomControls` | `boolean` | `true` | Toolbar zoom buttons |
| `showResetControl` | `boolean` | `true` | Reset zoom/pan button |
| `showFrameIndicator` | `boolean` | `true` | Frame counter badge |
| `showDragHint` | `boolean` | `true` | Helper text in toolbar |
| `aspectRatio` | `string` | `'16 / 10'` | CSS aspect-ratio value |
| `labels` | `Viewer360Labels` | English defaults | Localized strings |
| `classNames` | `Viewer360ClassNames` | BEM classes | Override CSS hooks |
| `theme` | `Viewer360Theme` | light palette | CSS variable overrides |
| `hotspotPin` | `Viewer360HotspotPinOptions` | — | Built-in marker pin with tooltip/delete |
| `renderHotspot` | `function` | — | Fully custom hotspot UI |
| `renderToolbar` | `function` | — | App design-system toolbar |
| `renderLoading` | `function` | — | Custom loading overlay |
| `renderFrameIndicator` | `function` | — | Custom frame badge |
| `renderHotspotModeBanner` | `function` | — | Custom add-mode banner |

## Headless usage

Use `useViewer360` when you need full control over markup:

```tsx
import { useViewer360 } from '@mmmmzxe/react-360-viewer';

const viewer = useViewer360({
  frames,
  currentFrameIndex,
  onFrameChange: setFrameIndex,
});
```

The hook exposes canvas refs, interaction handlers, zoom state, and hotspot positioning helpers.

## Theming

Override CSS variables on the root element or pass `theme`:

```tsx
<Viewer360
  theme={{
    '--viewer-bg': '#111827',
    '--viewer-text': '#f9fafb',
    '--viewer-accent': '#3b82f6',
  }}
/>
```

See the `theme` prop on `Viewer360` for supported CSS variable overrides.

## Package structure

```
src/
  components/
    ui/             Badge, Button, Card, Item, Label, Popover, Separator, Spinner
    utils/          cn helper
  feature/          Viewer360 and sub-components
  constants/
  helpers/
  hooks/
  types/
```

The published package includes `dist/` (ESM + type declarations) and `src/` (for Tailwind `@source` scanning).

## Development

```bash
npm install
npm run test-run
npm run build
```

## Publishing

```bash
npm publish
```

`prepublishOnly` runs the build automatically. The package ships ESM + type declarations from `dist/`.

## License

MIT
