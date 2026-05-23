# Navigations

> Source: https://playwright.dev/docs/navigations

## Background

Playwright can navigate to URLs and handle navigations caused by page interactions.

## Basic Navigation

```typescript
await page.goto('https://example.com');
```

This waits for the page to fire the `load` event (whole page loaded including stylesheets, scripts, iframes, images).

**Note:** If the page does a client-side redirect before `load`, `page.goto()` waits for the redirected page to fire the `load` event.

## When is the Page Loaded?

Modern pages perform activities after the `load` event. In Playwright, you can interact with the page at any moment - it automatically waits for elements to become actionable.

```typescript
// Navigate and click element
await page.goto('https://example.com');
await page.getByText('Example Domain').click();
```

Playwright waits for:
- Element to become visible
- Actionability checks to pass
- Then performs the action

## Hydration Issues

If actions seem to have no effect, the page may have poor hydration. Static content loads first, then dynamic parts later.

**Symptoms:**
- Clicks are ignored
- Entered text disappears

**Solution:** Ensure interactive controls are disabled until hydration is complete.

**Verification:** Open Chrome DevTools with "Slow 3G" emulation and test interactions.

## Waiting for Navigation

When clicking triggers navigation:

```typescript
await page.getByText('Click me').click();
await page.waitForURL('**/login');
```

## Multiple Navigations

For actions that trigger multiple navigations:

```typescript
// Wait for specific URL pattern
await page.waitForURL('**/dashboard');

// Wait for navigation to complete
await page.waitForLoadState();
```

## Navigation Lifecycle

1. **Navigation starts** - URL change or page interaction
2. **Navigation committed** - Response headers parsed, history updated
3. **Loading** - Document loaded, parsed, scripts executed
4. **Events fired**:
   - `page.url()` set to new URL
   - `page.on('domcontentloaded')` fired
   - Resources loaded (styles, images)
   - `page.on('load')` fired
   - Dynamic scripts executed

## Load States

```typescript
// Wait for domcontentloaded
await page.waitForLoadState('domcontentloaded');

// Wait for load event
await page.waitForLoadState('load');

// Wait for networkidle
await page.waitForLoadState('networkidle');
```

## Best Practices

- Let Playwright auto-wait instead of adding manual waits
- Use `waitForURL()` after clicks that navigate
- Be aware of hydration issues with SPA frameworks
- Understand the navigation lifecycle for debugging
- Use `waitForLoadState()` for specific load conditions
