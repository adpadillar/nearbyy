# @nearbyy/ui

This package is the internal UI library for the Nearbyy project. It has both custom components and shadcn/ui components.

## Installation

To use this in an app inside the monorepo, install, cd into the app, and run `pnpm add @nearbyy/ui`.

Once installed, add this to the `tsconfig.json` of the app:

```json
{
  "compilerOptions": {
    // ...
    "paths": {
      // ...
      "@/components": ["../../packages/ui/src/components"],
      "@/utils": ["../../packages/ui/src/lib/utils.ts"]
    }
  }
}
```

This will allow you to use components without a build step.

### For next.js apps

If you are using this in a next.js app, you will need to add the following to the `next.config.js`:

```js
transpilePackages: ['@nearbyy/ui'],
```

This will enable hot module reloading when changes are made to the UI library.

### Tailwind CSS

Tailwind is installed in this package, to recompile the styles, run `pnpm run build`, which will recompile the styles and output them to the `dist` folder. If you want to watch for changes, run `pnpm dev`.

## Usage

Make sure to include the `@nearbyy/ui` styles in your app. This can be done by importing the `styles.css` file in the `pages/layout.tsx` file.

```tsx
// pages/layout.tsx
import "@nearbyy/ui/dist/output.css";

export default function Layout({ children }) {
  return <>{children}</>;
}
```

To use a component, import it from `@nearbyy/ui` and use it in your app.

```tsx
// components/MyComponent.tsx
import { Button } from "@nearbyy/ui";

export default function MyComponent() {
  return <Button>Click me</Button>;
}
```
