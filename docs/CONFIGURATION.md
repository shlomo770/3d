# Configuration Guide

## הסתרת פאנל

```ts
layout: {
  rightPanel: { visible: false }
}
```

## שינוי רוחב פאנלים

```ts
leftPanel: { widthPx: 320 }
```

## שינוי Status Bar

```ts
statusBar: {
  items: [
    { id: "gps", enabled: false }
  ]
}
```

## שינוי Side Nav

```ts
navigation: {
  items: [
    { id: "reports", enabled: false }
  ]
}
```

## שינוי כלי ציור

```ts
mapTools: {
  tools: [
    { id: "ellipse", enabled: false }
  ]
}
```

## שינוי מפה

```ts
map2d: {
  center: [34.78, 32.08],
  zoom: 13
}
```
