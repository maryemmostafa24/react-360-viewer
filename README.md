# @mmmmzxe/react-360-viewer

A standalone, configurable 360° image viewer for React. Drag to rotate through frames, scroll or use toolbar controls to zoom, pan when zoomed in, optionally auto-rotate, and place interactive hotspots on any frame.

## Features

- Drag-to-rotate frame navigation
- Zoom via scroll wheel or toolbar controls
- Pan when zoomed in
- Optional auto-rotate
- Built-in hotspot marker pins with **hover tooltips**
- Frame indicator badge (e.g. `Interior · 1 / 3`)
- Hotspot add mode for placing new markers
- shadcn-style UI with Tailwind CSS design tokens
- TypeScript-first API
- Headless `useViewer360` hook for custom UIs

## Installation

```bash
npm install @mmmmzxe/react-360-viewer
# or
bun add @mmmmzxe/react-360-viewer
```

### Peer dependencies

| Package | Version |
|---------|---------|
| `react` | `>=18` |
| `react-dom` | `>=18` |
| `lucide-react` | `>=0.400.0` |

### Styles — zero setup

**You do not need to import any CSS file.** Styles are injected automatically when you import from the package:

```tsx
import { Viewer360 } from '@mmmmzxe/react-360-viewer';
// That's it — hover tooltips, frame indicator, cursors all work
```

The bundle injects all required Tailwind CSS on first import (hover tooltips, frame indicator position, `cursor-crosshair` in add mode, etc.).

Default shadcn-compatible CSS variables are included. If your app already uses shadcn/ui, your existing `:root` variables are used automatically.

#### Optional: manual CSS import

If you prefer a separate stylesheet instead of auto-injection:

```tsx
import '@mmmmzxe/react-360-viewer/styles.css';
```

#### Optional: Tailwind `@source`

For advanced Tailwind customization, add to your global CSS:

```css
@source "../node_modules/@mmmmzxe/react-360-viewer/src/**/*.{ts,tsx}";
```

---

## How it works

### Component layout

```
┌─────────────────────────────────────────────┐
│  Card (root)                                │
│  ┌─────────────────────────────────────────┐│
│  │  Viewport (canvas + overlays)           ││
│  │  • Canvas — draws the current frame     ││
│  │  • Overlay — hotspot markers            ││
│  │  • Frame indicator — bottom-left badge  ││
│  │  • Add-mode banner — top center         ││
│  │  • Loading overlay                      ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │  Toolbar — zoom, reset, add hotspot     ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

### Interaction model

| Action | Behavior |
|--------|----------|
| **Drag horizontally** | Rotates through frames (wraps around) |
| **Scroll wheel** | Zoom in / out |
| **Drag while zoomed** | Pans the image |
| **Reset button** | Returns zoom and pan to default |
| **Auto-rotate** | Advances frames automatically when enabled |
| **Hotspot mode** | Cursor becomes crosshair; click places a hotspot |
| **Hover hotspot dot** | Shows tooltip with title, description, optional delete |
| **Click hotspot dot** | Fires `onHotspotClick` if provided |

### Coordinate system

Hotspots use **percentage-based positions** (`positionX`, `positionY` from `0` to `100`) relative to the image area, tied to a specific `frameIndex`. Coordinates stay aligned when zooming or panning.

When add mode is active and you click the viewport, `onHotspotAdd` receives:

```ts
{
  frameIndex: number;
  frameId: string;
  positionX: number; // 0–100
  positionY: number; // 0–100
}
```

---

## Quick start

```tsx
import { useState } from 'react';
import { Viewer360, type Viewer360Frame } from '@mmmmzxe/react-360-viewer';

const frames: Viewer360Frame[] = [
  { id: '1', src: '/images/frame-01.jpg', label: 'Front' },
  { id: '2', src: '/images/frame-02.jpg', label: 'Front-right' },
  { id: '3', src: '/images/frame-03.jpg', label: 'Side' },
];

export function ProductViewer() {
  const [frameIndex, setFrameIndex] = useState(0);

  return (
    <Viewer360
      frames={frames}
      currentFrameIndex={frameIndex}
      onFrameChange={setFrameIndex}
      config={{ dragSensitivity: 8 }}
    />
  );
}
```

---

## Frames

Each frame is an image source with an optional label shown in the frame indicator:

```ts
type Viewer360Frame = {
  id: string;      // unique identifier
  src: string;     // image URL
  label?: string;  // e.g. "Interior", "Motor" — shown in frame badge
};
```

The frame indicator defaults to `Label · 1 / 3` when a label is set, or `1 / 3` without one. It appears at the **bottom-left** of the viewport.

### Frame indicator

**Default (recommended)** — positioning is handled automatically:

```tsx
<Viewer360
  frames={frames}
  showFrameIndicator
  labels={{
    frameIndicator: ({ current, total, label }) =>
      label ? `${label} · ${current} / ${total}` : `${current} / ${total}`,
  }}
/>
```

**Custom render** — you must pass positioning classes yourself:

```tsx
import {
  Viewer360,
  Viewer360FrameIndicator,
  viewer360ClassNames,
} from '@mmmmzxe/react-360-viewer';

<Viewer360
  frames={frames}
  renderFrameIndicator={({ currentFrameIndex, frameCount, frameLabel, labels }) => (
    <Viewer360FrameIndicator
      className={viewer360ClassNames.frameIndicator}
      label={labels.frameIndicator({
        current: currentFrameIndex + 1,
        total: frameCount,
        label: frameLabel,
      })}
    />
  )}
/>
```

> **Important:** If you use `renderFrameIndicator` without `className={viewer360ClassNames.frameIndicator}`, the badge will not be positioned correctly (it will appear at the top-left with no absolute layout).

Override position via `classNames`:

```tsx
<Viewer360
  classNames={{
    frameIndicator: 'absolute bottom-4 start-4 z-20 whitespace-nowrap ...',
  }}
/>
```

---

## Hotspots & markers

### Data model

```ts
type Viewer360Hotspot<TData = unknown> = {
  id: string;
  frameIndex: number;
  positionX: number; // 0–100
  positionY: number; // 0–100
  data?: TData;      // optional typed payload
};
```

### Built-in marker pins (default)

Every hotspot automatically renders as a red marker pin with a **hover tooltip**. No extra setup required:

```tsx
<Viewer360 frames={frames} hotspots={hotspots} />
```

Hover the dot to see the title and description. Tap or focus the dot on touch devices.

### Converting markers to hotspots

Use `toViewer360Hotspots` to map your app's marker records:

```tsx
import { Viewer360, toViewer360Hotspots } from '@mmmmzxe/react-360-viewer';

const hotspots = toViewer360Hotspots([
  {
    id: '1',
    frameIndex: 0,
    positionX: 42,
    positionY: 58,
    title: 'Scratch',
    description: 'Front bumper',
  },
]);
```

If `hotspot.data` contains `{ title: string, description?: string }`, the built-in pin uses those for the tooltip. Otherwise it falls back to `hotspot.id` as the title.

### Hotspot pin options

Pass `hotspotPin` to add delete, custom tags, or styling. The built-in pin UI is always used unless you provide `renderHotspot`.

```tsx
<Viewer360
  frames={frames}
  hotspots={hotspots}
  showHotspotModeControl
  hotspotPin={{
    onDelete: (id) => removeMarker(id),
    deletingMarkerId: pendingDeleteId,
    getMarker: (hotspot) => ({
      id: hotspot.id,
      title: hotspot.data?.title ?? 'Damage',
      description: hotspot.data?.description,
    }),
    renderTag: ({ marker, hotspot }) => (
      <Badge>{hotspot.data?.severity}</Badge>
    ),
    classNames: {
      dot: 'size-5 bg-red-600',
      tooltip: 'w-72',
    },
    labels: {
      delete: 'Remove damage',
    },
  }}
  onHotspotAdd={(position) => saveMarker(position)}
/>
```

| `hotspotPin` option | Type | Description |
|---------------------|------|-------------|
| `onDelete` | `(id: string) => void` | Shows delete button in tooltip |
| `deletingMarkerId` | `string \| null` | Disables delete while pending |
| `getMarker` | `(hotspot) => Viewer360Marker` | Custom title/description mapping |
| `renderTag` | `(props) => ReactNode` | Extra content in tooltip (e.g. severity badge) |
| `classNames` | `Viewer360MarkerPinClassNames` | Override pin/dot/tooltip styles |
| `labels` | `Viewer360MarkerPinLabels` | Override delete button label |

### Hotspot add mode

Enable placing new hotspots by clicking the image:

```tsx
const [isAddMode, setIsAddMode] = useState(false);

<Viewer360
  frames={frames}
  hotspots={hotspots}
  showHotspotModeControl       // shows "Add hotspot" button in toolbar
  hotspotMode={isAddMode}      // controlled add mode
  onHotspotModeChange={setIsAddMode}
  onHotspotAdd={(position) => {
    // position: { frameIndex, frameId, positionX, positionY }
    openAddDialog(position);
  }}
/>
```

When add mode is active:
- Cursor becomes a crosshair
- A banner appears: *"Click on the image to place a hotspot"*
- Clicking the viewport calls `onHotspotAdd` with normalized coordinates
- Drag and auto-rotate are disabled in add mode

### Fully custom hotspot UI

Use `renderHotspot` only when you need complete control over marker markup:

```tsx
<Viewer360
  frames={frames}
  hotspots={hotspots}
  renderHotspot={({ hotspot, leftPercent, topPercent }) => (
    <button
      className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"
      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
      onClick={() => alert(hotspot.data?.title)}
    />
  )}
/>
```

> When `renderHotspot` is provided, the built-in marker pin is **not** used.

### Click handler

```tsx
<Viewer360
  hotspots={hotspots}
  onHotspotClick={(hotspot, event) => {
    console.log('Clicked', hotspot.id);
  }}
/>
```

---

## Controlled vs uncontrolled state

| State | Controlled prop | Uncontrolled default | Callback |
|-------|-------------------|----------------------|----------|
| Frame index | `currentFrameIndex` | `defaultFrameIndex` (0) | `onFrameChange` |
| Hotspot add mode | `hotspotMode` | `defaultHotspotMode` (false) | `onHotspotModeChange` |

```tsx
// Controlled — parent owns state
const [frameIndex, setFrameIndex] = useState(0);

<Viewer360
  currentFrameIndex={frameIndex}
  onFrameChange={setFrameIndex}
/>

// Uncontrolled — component manages its own frame index
<Viewer360 frames={frames} defaultFrameIndex={2} />
```

---

## Configuration

### Viewer config

```ts
type Viewer360Config = {
  minZoom?: number;              // default: 1
  maxZoom?: number;              // default: 3
  zoomStep?: number;             // default: 0.15
  dragSensitivity?: number;      // default: 8 (pixels per frame)
  autoRotate?: boolean;          // default: false
  autoRotateIntervalMs?: number; // default: 100
  autoRotateDirection?: 'forward' | 'backward'; // default: 'forward'
};
```

Auto-rotate pauses while dragging, in hotspot add mode, or when zoomed above `minZoom`.

```tsx
<Viewer360
  config={{
    minZoom: 1,
    maxZoom: 4,
    zoomStep: 0.2,
    dragSensitivity: 10,
    autoRotate: true,
    autoRotateIntervalMs: 150,
    autoRotateDirection: 'forward',
  }}
/>
```

### Viewer360 props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `frames` | `Viewer360Frame[]` | **required** | Image sources |
| `currentFrameIndex` | `number` | — | Controlled frame index |
| `defaultFrameIndex` | `number` | `0` | Initial frame when uncontrolled |
| `onFrameChange` | `(index) => void` | — | Called when frame changes |
| `hotspots` | `Viewer360Hotspot[]` | `[]` | Markers to display |
| `config` | `Viewer360Config` | see above | Zoom, drag, auto-rotate |
| `aspectRatio` | `string` | `'16 / 10'` | CSS `aspect-ratio` for viewport |
| `className` | `string` | — | Extra classes on root card |
| `classNames` | `Viewer360ClassNames` | — | Override internal element classes |
| `style` | `CSSProperties` | — | Inline styles on root |
| `theme` | `Viewer360Theme` | — | CSS variable overrides |
| `labels` | `Viewer360Labels` | English defaults | Localized strings |
| `showZoomControls` | `boolean` | `true` | Toolbar zoom buttons |
| `showResetControl` | `boolean` | `true` | Reset zoom/pan button |
| `showFrameIndicator` | `boolean` | `true` | Frame counter badge |
| `showDragHint` | `boolean` | `true` | "Drag to rotate" hint in toolbar |
| `showHotspotModeControl` | `boolean` | `false` | "Add hotspot" toolbar button |
| `hotspotMode` | `boolean` | — | Controlled add mode |
| `defaultHotspotMode` | `boolean` | `false` | Initial add mode |
| `onHotspotModeChange` | `(active) => void` | — | Add mode toggle callback |
| `onHotspotAdd` | `(position) => void` | — | Called when placing a hotspot |
| `onHotspotClick` | `(hotspot, event) => void` | — | Called when clicking a hotspot |
| `hotspotPin` | `Viewer360HotspotPinOptions` | — | Pin tooltip/delete/tag options |
| `renderHotspot` | `function` | — | Fully custom hotspot UI |
| `renderToolbar` | `function` | — | Custom toolbar |
| `renderLoading` | `function` | — | Custom loading overlay |
| `renderFrameIndicator` | `function` | — | Custom frame badge |
| `renderHotspotModeBanner` | `function` | — | Custom add-mode banner |
| `children` | `ReactNode` | — | Extra content inside overlay |

### Labels

```ts
type Viewer360Labels = {
  loading?: string;
  dragHint?: string;
  frameIndicator?: (params: { current: number; total: number; label?: string }) => string;
  zoom?: (percent: number) => string;
  hotspotModeActive?: string;
  addHotspot?: string;
  zoomIn?: string;
  zoomOut?: string;
  resetView?: string;
  deleteMarker?: string;
};
```

Default `frameIndicator` format: `Interior · 1 / 3`.

### Class names

Import defaults and extend:

```tsx
import { viewer360ClassNames, viewer360MarkerPinClassNames } from '@mmmmzxe/react-360-viewer';

<Viewer360
  classNames={{
    root: 'shadow-lg',
    viewport: 'bg-black',
    frameIndicator: `${viewer360ClassNames.frameIndicator} whitespace-nowrap`,
  }}
/>
```

| Key | Element |
|-----|---------|
| `root` | Outer card |
| `viewport` | Image area |
| `canvas` | Canvas element |
| `overlay` | Hotspot overlay container |
| `loading` | Loading overlay |
| `loadingText` | Loading text |
| `frameIndicator` | Frame badge |
| `hotspotModeBanner` | Add-mode banner |
| `toolbar` | Bottom toolbar |
| `dragHint` | Drag hint text |
| `controls` | Toolbar controls group |
| `zoomDisplay` | Zoom percentage badge |

---

## Customization & render props

Replace any built-in UI section with your own components:

```tsx
<Viewer360
  frames={frames}
  renderToolbar={(props) => <MyCustomToolbar {...props} />}
  renderLoading={() => <MySpinner />}
  renderFrameIndicator={(props) => (
    <Viewer360FrameIndicator
      className={viewer360ClassNames.frameIndicator}
      label={props.labels.frameIndicator({
        current: props.currentFrameIndex + 1,
        total: props.frameCount,
        label: props.frameLabel,
      })}
    />
  )}
  renderHotspotModeBanner={({ labels }) => (
    <div className="absolute top-4 left-1/2 -translate-x-1/2">
      {labels.hotspotModeActive}
    </div>
  )}
/>
```

### Theming

Pass CSS variables via `theme` or style the root with your own tokens:

```tsx
<Viewer360
  theme={{
    '--viewer-bg': '#111827',
    '--viewer-border': '#374151',
    '--viewer-text': '#f9fafb',
    '--viewer-muted': '#9ca3af',
    '--viewer-accent': '#3b82f6',
    '--viewer-accent-foreground': '#ffffff',
    '--viewer-control-bg': '#1f2937',
    '--viewer-control-border': '#374151',
    '--viewer-hotspot-banner-bg': '#fef3c7',
    '--viewer-hotspot-banner-border': '#fcd34d',
    '--viewer-hotspot-banner-text': '#92400e',
  }}
/>
```

---

## Real-world integration example

Typical pattern for a vehicle damage viewer:

```tsx
import { Viewer360 } from '@mmmmzxe/react-360-viewer';

export function Vehicle360Viewer({ frames, markers, frameIndex, onFrameChange }) {
  const hotspots = markers.map((m) => ({
    id: String(m.id),
    frameIndex: m.frameIndex,
    positionX: m.positionX,
    positionY: m.positionY,
    data: m,
  }));

  return (
    <Viewer360
      frames={frames.map((f, i) => ({
        id: String(f.id),
        src: f.url,
        label: f.label,
      }))}
      hotspots={hotspots}
      currentFrameIndex={frameIndex}
      onFrameChange={onFrameChange}
      showHotspotModeControl
      showFrameIndicator
      hotspotMode={isAddMode}
      onHotspotModeChange={setIsAddMode}
      onHotspotAdd={handleAdd}
      hotspotPin={{
        onDelete: (id) => deleteMarker(Number(id)),
        deletingMarkerId: pendingId ? String(pendingId) : null,
        getMarker: (h) => ({
          id: h.id,
          title: h.data?.title ?? 'Damage',
          description: h.data?.description,
        }),
        renderTag: (props) => <DamageTag {...props} />,
      }}
      labels={{
        addHotspot: 'Add damage',
        frameIndicator: ({ current, total, label }) =>
          label ? `${label} · ${current} / ${total}` : `${current} / ${total}`,
      }}
    />
  );
}
```

---

## Headless usage

Use `useViewer360` when you need full control over markup and layout:

```tsx
import { useViewer360 } from '@mmmmzxe/react-360-viewer';

function CustomViewer() {
  const [frameIndex, setFrameIndex] = useState(0);

  const {
    canvasRef,
    containerRef,
    currentFrame,
    currentFrameHotspots,
    imagesLoaded,
    zoom,
    minZoom,
    maxZoom,
    isResetDisabled,
    viewerCursorClass,
    getHotspotScreenPosition,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    handleCanvasClick,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
  } = useViewer360({
    frames,
    currentFrameIndex: frameIndex,
    onFrameChange: setFrameIndex,
    hotspots,
    config: { maxZoom: 4 },
    hotspotMode: false,
    onHotspotAdd: (pos) => console.log(pos),
  });

  return (
    <div
      ref={containerRef}
      className={viewerCursorClass}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onClick={handleCanvasClick}
    >
      <canvas ref={canvasRef} />
      {!imagesLoaded && <p>Loading…</p>}
      {currentFrameHotspots.map((h) => {
        const pos = getHotspotScreenPosition(h);
        return <div key={h.id} style={{ left: `${pos.leftPercent}%`, top: `${pos.topPercent}%` }} />;
      })}
    </div>
  );
}
```

### Hook return values

| Value | Description |
|-------|-------------|
| `canvasRef` | Attach to `<canvas>` |
| `containerRef` | Attach to viewport container |
| `currentFrame` | Active `Viewer360Frame` |
| `currentFrameHotspots` | Hotspots for current frame |
| `imagesLoaded` | All frame images preloaded |
| `zoom` | Current zoom level |
| `minZoom` / `maxZoom` | Zoom bounds |
| `isResetDisabled` | Whether reset has no effect |
| `isHotspotMode` | Add mode active |
| `viewerCursorClass` | Cursor class for viewport |
| `getHotspotScreenPosition` | Maps hotspot to screen % |
| `getCurrentImageLayout` | Current image layout metrics |
| `handlePointerDown/Move/Up` | Drag handlers |
| `handleWheel` | Zoom on scroll |
| `handleCanvasClick` | Click handler (add mode) |
| `handleZoomIn/Out` | Step zoom |
| `handleResetView` | Reset zoom and pan |

---

## Exported utilities

| Export | Purpose |
|--------|---------|
| `toViewer360Hotspots` | Convert marker records to hotspot array |
| `hotspotToViewer360Marker` | Extract title/description from hotspot data |
| `filterHotspotsByFrame` | Filter hotspots by frame index |
| `computeHotspotScreenPosition` | Map stored coords to screen position |
| `computeHotspotPositionFromClick` | Derive coords from click event |
| `computeViewerImageLayout` | Image letterbox layout math |
| `computeDragFrameIndex` | Drag delta → frame index |
| `preloadViewerFrames` | Preload all frame images |
| `viewer360ClassNames` | Default Tailwind class map |
| `viewer360MarkerPinClassNames` | Default pin class map |
| `defaultViewer360Labels` | Default label strings |
| `defaultViewer360Config` | Default config values |

### Sub-components

These can be used standalone in custom render props:

- `Viewer360FrameIndicator` — frame badge
- `Viewer360MarkerPin` — hotspot dot + hover tooltip
- `Viewer360Toolbar` — bottom control bar
- `Viewer360LoadingOverlay` — loading state
- `Viewer360AddModeBanner` — add-mode banner

---

## Package structure

```
src/
  components/
    ui/             Badge, Button, Card, Item, Label, Popover, Separator, Spinner
    utils/          cn helper
  feature/          Viewer360 and sub-components
  constants/        Default config, labels, class names
  helpers/          Zoom, layout, hotspot, canvas utilities
  hooks/            useViewer360
  types/            TypeScript definitions
```

The published package includes:

- `dist/index.js` — ESM bundle
- `dist/index.d.ts` — TypeScript types
- `dist/styles.css` — pre-built Tailwind CSS (import this in your app)
- `src/` — source files (optional, for Tailwind `@source` scanning)

---

## Development

```bash
npm install
npm run test-run   # run tests
npm run build      # build dist/
npm run dev        # watch mode
npm run tsc        # type check
```

## Publishing

```bash
npm version patch   # bump version (required — npm rejects duplicate versions)
npm publish
```

`prepublishOnly` runs the build automatically. The package ships ESM + type declarations from `dist/`.

## License

MIT
