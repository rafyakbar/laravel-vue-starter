# Pages

> Source: https://playwright.dev/docs/pages

## Background

Each BrowserContext can have multiple pages. A Page refers to a single tab or popup window within a browser context, used to navigate to URLs and interact with page content.

## Creating Pages

```typescript
// Create a page
const page = await context.newPage();

// Navigate explicitly
await page.goto('http://example.com');

// Fill an input
await page.locator('#search').fill('query');

// Navigate by clicking
await page.locator('#submit').click();
console.log(page.url());
```

## Multiple Pages

Each browser context can host multiple pages (tabs):

```typescript
// Create two pages
const pageOne = await context.newPage();
const pageTwo = await context.newPage();

// Get all pages of a context
const allPages = context.pages();
```

Pages inside a context:
- Behave like focused, active pages
- Respect context-level emulation (viewport, routes, locale)

## Handling New Pages

Handle pages opened by `target="_blank"` links:

```typescript
// Start waiting for new page before clicking
const pagePromise = context.waitForEvent('page');
await page.getByText('open new tab').click();
const newPage = await pagePromise;

// Interact with the new page
await newPage.getByRole('button').click();
console.log(await newPage.title());
```

Handle unknown page triggers:

```typescript
context.on('page', async page => {
  await page.waitForLoadState();
  console.log(await page.title());
});
```

## Handling Popups

Listen for popup events on a specific page:

```typescript
// Start waiting for popup before clicking
const popupPromise = page.waitForEvent('popup');
await page.getByText('open the popup').click();
const popup = await popupPromise;

// Interact with the popup
await popup.getByRole('button').click();
console.log(await popup.title());
```

Handle unknown popup triggers:

```typescript
page.on('popup', async popup => {
  await popup.waitForLoadState();
  console.log(await popup.title());
});
```

## Page Methods

| Method | Description |
|--------|-------------|
| `page.goto(url)` | Navigate to URL |
| `page.url()` | Get current URL |
| `page.title()` | Get page title |
| `page.content()` | Get HTML content |
| `page.close()` | Close the page |
| `page.reload()` | Reload page |
| `page.goBack()` | Go back in history |
| `page.goForward()` | Go forward in history |

## Best Practices

- Use `waitForEvent('page')` before clicking links that open new tabs
- Close pages when done to free resources
- Remember that each context can have multiple independent pages
- Use `page.on('popup')` for page-specific popup handling
