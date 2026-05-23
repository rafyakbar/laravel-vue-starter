# Other Locators

> Source: https://playwright.dev/docs/other-locators

## Background

In addition to recommended locators like `getByRole()` and `getByText()`, Playwright supports various other locator strategies including CSS selectors, XPath, and legacy text locators. These provide flexibility when user-visible locators aren't sufficient, though they're generally less resilient to page changes.

## CSS Locator

Playwright can locate elements by CSS selector with augmented capabilities that pierce shadow DOM and add custom pseudo-classes.

```typescript
await page.locator('css=button').click();
```

### CSS: Matching by Text

Playwright includes pseudo-classes for text matching:

```typescript
// Match element containing text anywhere inside
await page.locator('article:has-text("Playwright")').click();

// Match smallest element with exact text
await page.locator('#nav-bar :text("Home")').click();

// Match with exact text (case-sensitive)
await page.locator('#nav-bar :text-is("Home")').click();

// Match with regex pattern
await page.locator('#nav-bar :text-matches("Log\\s*in", "i")').click();
```

### CSS: Visible Elements

The `:visible` pseudo-class filters to only visible elements:

```typescript
// Only clicks visible buttons
await page.locator('button:visible').click();
```

### CSS: Elements Containing Other Elements

The `:has()` pseudo-class matches elements containing specific children:

```typescript
await page.locator('article:has(div.promo)').textContent();
```

### CSS: Matching by Layout

Layout pseudo-classes match elements based on position relative to other elements:

```typescript
// Input to the right of "Username" label
await page.locator('input:right-of(:text("Username"))').fill('value');

// Button near promo card
await page.locator('button:near(.promo-card)').click();

// With maximum pixel distance
await page.locator('button:near(:text("Username"), 120)').click();
```

### CSS: N-th Match

Use `:nth-match()` to select a specific element from multiple matches:

```typescript
// Click third "Buy" button
await page.locator(':nth-match(:text("Buy"), 3)').click();
```

## N-th Element Locator

Use `nth=` with a zero-based index to narrow to specific matches:

```typescript
// Click first button
await page.locator('button').locator('nth=0').click();

// Click last button
await page.locator('button').locator('nth=-1').click();
```

## Parent Element Locator

Target parent elements using `locator.filter()` or `xpath=..`:

```typescript
// Using filter (recommended)
const child = page.getByText('Hello');
const parent = page.getByRole('listitem').filter({ has: child });

// Using xpath (less reliable)
const parent = page.getByText('Hello').locator('xpath=..');
```

## XPath Locator

XPath selectors work via `Document.evaluate()`:

```typescript
await page.locator('xpath=//button').click();

// Shorthand - any string starting with // is assumed XPath
await page.locator('//html/body').click();
```

XPath union with pipe operator matches multiple selectors:

```typescript
// Wait for either spinner or confirmation
await page.locator(`
  //span[contains(@class, 'spinner__loading')]|//div[@id='confirmation']
`).waitFor();
```

## Label to Form Control Retargeting

Targeting labels automatically performs actions on associated inputs:

```typescript
// Fill input by targeting its label
await page.getByText('Password').fill('secret');
```

## Legacy Text Locator

The legacy text locator matches elements containing text:

```typescript
// Case-insensitive substring match
await page.locator('text=Log in').click();

// Exact match (case-sensitive)
await page.locator('text="Log in"').click();

// Regex pattern
await page.locator('text=/Log\\s*in/i').click();
```

## Attribute Selectors

Shorthand for selecting by specific attributes:

```typescript
// By id
await page.locator('id=username').fill('value');

// By data-testid
await page.locator('data-test-id=submit').click();
```

## Chaining Selectors

Chain selectors with `>>` to query relative to previous results:

```typescript
// Equivalent to nested querySelector calls
await page.locator('css=article >> css=.bar > .baz >> css=span[attr=value]');
```

## Best Practices

- Prefer user-visible locators (`getByRole`, `getByText`) over CSS/XPath
- Avoid layout-based selectors as they're sensitive to small UI changes
- Use `:has()` and `filter()` for parent elements instead of XPath
- Remember that XPath doesn't pierce shadow roots
- Keep selectors simple to improve maintainability
