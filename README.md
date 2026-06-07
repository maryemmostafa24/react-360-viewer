# @mmmmzxe/react-360-viewer

A standalone, configurable 360° image viewer for React with drag rotation, zoom, hotspots, and auto-rotate support.

## Features

* Drag-to-rotate frame navigation
* Zoom with mouse wheel and toolbar controls
* Pan when zoomed
* Optional auto-rotate
* Interactive hotspots with tooltips
* Hotspot add mode
* TypeScript support
* Tailwind + shadcn compatible
* Headless hook support

## Installation

```bash
npm install @mmmmzxe/react-360-viewer
```

### Peer Dependencies

```bash
npm install react react-dom lucide-react
```

### Styles

Import the stylesheet once in your app (e.g. in your root layout or entry file):

```tsx
import '@mmmmzxe/react-360-viewer/styles.css';
```

Styles are scoped to `[data-viewer-360]` via CSS `@scope` and will not override your app's global theme or Tailwind classes. Requires a **client component** in Next.js App Router (`'use client'`).

Wrap the viewer in a sized container if needed:

```tsx
<div className="w-full max-w-3xl">
  <Viewer360 frames={frames} />
</div>
```

If styles don't appear after updating, delete `.next` and restart the dev server.

---

## Quick Start

```tsx
'use client';

import '@mmmmzxe/react-360-viewer/styles.css';
import { useState } from "react";
import {
  Viewer360,
  type Viewer360Frame,
} from "@mmmmzxe/react-360-viewer";

const frames: Viewer360Frame[] = [
  { id: "1", src: "/images/frame-01.jpg", label: "Front" },
  { id: "2", src: "/images/frame-02.jpg", label: "Side" },
  { id: "3", src: "/images/frame-03.jpg", label: "Rear" },
];

export default function ProductViewer() {
  const [frameIndex, setFrameIndex] = useState(0);

  return (
    <Viewer360
      frames={frames}
      currentFrameIndex={frameIndex}
      onFrameChange={setFrameIndex}
    />
  );
}
```

## Hotspots

```tsx
<Viewer360
  frames={frames}
  hotspots={[
    {
      id: "1",
      frameIndex: 0,
      positionX: 50,
      positionY: 40,
      data: {
        title: "Scratch",
        description: "Front bumper",
      },
    },
  ]}
/>
```

### Add Hotspots

```tsx
<Viewer360
  frames={frames}
  hotspots={hotspots}
  showHotspotModeControl
  onHotspotAdd={(position) => {
    console.log(position);
  }}
/>
```

## Configuration

```tsx
<Viewer360
  config={{
    minZoom: 1,
    maxZoom: 4,
    zoomStep: 0.2,
    dragSensitivity: 8,
    autoRotate: true,
    autoRotateIntervalMs: 150,
  }}
/>
```

## Main Props

| Prop                   | Type               | Description               |
| ---------------------- | ------------------ | ------------------------- |
| frames                 | Viewer360Frame[]   | Required image frames     |
| hotspots               | Viewer360Hotspot[] | Hotspots to display       |
| currentFrameIndex      | number             | Controlled frame          |
| onFrameChange          | function           | Frame change callback     |
| config                 | Viewer360Config    | Viewer settings           |
| showFrameIndicator     | boolean            | Show frame counter        |
| showHotspotModeControl | boolean            | Enable add hotspot button |
| onHotspotAdd           | function           | Add hotspot callback      |

## Development

```bash
npm install
npm run build
npm run dev
npm run test-run
```

## Publishing

```bash
npm version patch
npm publish
```

## License

MIT
