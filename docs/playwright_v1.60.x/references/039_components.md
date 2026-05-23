# Components (Experimental)

> Source: https://playwright.dev/docs/test-components

## Background

Playwright Test can test your components directly. Tests run in Node.js while components run in the real browser, combining the best of both worlds.

## Example Test

```typescript
test('event should work', async ({ mount }) => {
  let clicked = false;

  const component = await mount(
    <Button title="Submit" onClick={() => { clicked = true }}></Button>
  );

  await expect(component).toContainText('Submit');
  await component.click();
  expect(clicked).toBeTruthy();
});
```

## Getting Started

### Step 1: Install

```bash
npm init playwright@latest -- --ct
```

This creates:
- `playwright/index.html` - HTML file for rendering components
- `playwright/index.ts` - Script for setup (styles, theme)

### Step 2: Create Test File

```typescript
// src/App.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import App from './App';

test('should work', async ({ mount }) => {
  const component = await mount(<App />);
  await expect(component).toContainText('Learn React');
});
```

### Step 3: Run Tests

```bash
npm run test-ct
```

## Limitations

You can't pass complex live objects to components:

```typescript
// This works
const component = await mount(<ProcessViewer process={{ name: 'playwright' }} />);

// This doesn't - process is a Node object
const component = await mount(<ProcessViewer process={process} />);
```

## Test Stories Pattern

Create a wrapper component for testing:

```typescript
// input-media.story.tsx
export function InputMediaForTest(props: { onMediaChange(mediaName: string): void }) {
  return <InputMedia onChange={media => props.onMediaChange(media.name)} />;
}
```

Test via the story:

```typescript
test('changes the image', async ({ mount }) => {
  let mediaSelected: string | null = null;

  const component = await mount(
    <InputMediaForTest onMediaChange={mediaName => { mediaSelected = mediaName; }} />
  );

  await component.getByTestId('imageInput').setInputFiles('src/assets/logo.png');
  await expect(component.getByAltText(/selected image/i)).toBeVisible();
  await expect.poll(() => mediaSelected).toBe('logo.png');
});
```

## API Reference

### Props

```typescript
const component = await mount(<Component msg="greetings" />);
```

### Callbacks/Events

```typescript
const component = await mount(<Component onClick={() => {}} />);
```

### Children/Slots

```typescript
const component = await mount(<Component>Child</Component>);
```

### Hooks

Configure app with `beforeMount` and `afterMount`:

```typescript
// playwright/index.tsx
import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import { BrowserRouter } from 'react-router-dom';

export type HooksConfig = { enableRouting?: boolean };

beforeMount<HooksConfig>(async ({ App, hooksConfig }) => {
  if (hooksConfig?.enableRouting)
    return <BrowserRouter><App /></BrowserRouter>;
});
```

Use in test:

```typescript
const component = await mount<HooksConfig>(<ProductsPage />, {
  hooksConfig: { enableRouting: true },
});
```

### Unmount

```typescript
const component = await mount(<Component />);
await component.unmount();
```

### Update

```typescript
const component = await mount(<Component />);
await component.update(<Component msg="greetings" onClick={() => {}}>Child</Component>);
```

### Network Requests

Use `router` fixture with MSW:

```typescript
test.beforeEach(async ({ router }) => {
  await router.use(...handlers);
});

test('example test', async ({ mount, router }) => {
  await router.use(http.get('/data', async () => {
    return HttpResponse.json({ value: 'mocked' });
  }));
});
```

## Best Practices

- Keep `mount()` close to assertions - avoid `beforeEach` mounting
- Module mocks don't cross Node/browser boundary - use hooksConfig instead
- Reset browser state when components depend on globals
- Focus on user-visible behavior, not component internals

## Frequently Asked Questions

### Difference from @playwright/test?

`@playwright/experimental-ct-{react,vue}` wraps `@playwright/test` and provides the `mount` fixture.

### Reuse Vite Config?

Copy path mappings and settings to `ctViteConfig`:

```typescript
export default defineConfig({
  use: {
    ctViteConfig: {
      // ...your vite config
    },
  },
});
```

### CSS Imports?

Vite handles CSS automatically. CSS Modules must be named `*.module.[css extension]`.

### Testing Pinia?

Initialize in `playwright/index.ts` with `beforeMount` hook.

### Access Component Methods?

Not recommended. Focus on user-visible behavior.
