# Locators

> Source: https://playwright.dev/docs/locators

## Background

Locators are the central piece of Playwright's auto-waiting and retry-ability. They represent a way to find elements on the page at any moment, re-querying each time they're used.

## Quick Guide: Recommended Locators

| Method | Use Case |
|--------|----------|
| `getByRole()` | Locate by accessibility attributes (recommended) |
| `getByText()` | Locate by text content |
| `getByLabel()` | Locate form control by label text |
| `getByPlaceholder()` | Locate input by placeholder |
| `getByAltText()` | Locate element by alt text |
| `getByTitle()` | Locate by title attribute |
| `getByTestId()` | Locate by `data-testid` attribute |

```typescript
await page.getByLabel('User Name').fill('John');
await page.getByLabel('Password').fill('secret-password');
await page.getByRole('button', { name: 'Sign in' }).click();
await expect(page.getByText('Welcome, John!')).toBeVisible();
```

## Locate by Role

Reflects how users and assistive technology perceive the page:

```typescript
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
await page.getByRole('checkbox', { name: 'Subscribe' }).check();
await page.getByRole('button', { name: /submit/i }).click();
```

## Locate by Label

For form fields with associated labels:

```typescript
await page.getByLabel('Password').fill('secret');
```

## Locate by Placeholder

For inputs without labels:

```typescript
await page.getByPlaceholder('name@example.com').fill('playwright@microsoft.com');
```

## Locate by Text

Find elements by text content:

```typescript
await expect(page.getByText('Welcome, John')).toBeVisible();
await expect(page.getByText('Welcome, John', { exact: true })).toBeVisible();
await expect(page.getByText(/welcome, [A-Za-z]+$/i)).toBeVisible();
```

## Locate by Alt Text

For images and elements with alt attributes:

```typescript
await page.getByAltText('playwright logo').click();
```

## Locate by Title

For elements with title attribute:

```typescript
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
```

## Locate by Test ID

Most resilient but not user-facing:

```typescript
await page.getByTestId('directions').click();
```

### Custom Test ID Attribute

```typescript
// playwright.config.ts
export default defineConfig({
  use: { testIdAttribute: 'data-pw' }
});
```

## Filtering Locators

### Filter by Text

```typescript
await page
  .getByRole('listitem')
  .filter({ hasText: 'Product 2' })
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

### Filter by Not Having Text

```typescript
await expect(page.getByRole('listitem').filter({ hasNotText: 'Out of stock' })).toHaveCount(5);
```

### Filter by Child/Descendant

```typescript
await page
  .getByRole('listitem')
  .filter({ has: page.getByRole('heading', { name: 'Product 2' }) })
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

## Locator Operators

### Chaining Locators

```typescript
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });
await product.getByRole('button', { name: 'Add to cart' }).click();
```

### Matching Two Locators (and)

```typescript
const button = page.getByRole('button').and(page.getByTitle('Subscribe'));
```

### Matching Alternatives (or)

```typescript
const newEmail = page.getByRole('button', { name: 'New' });
const dialog = page.getByText('Confirm security settings');
await expect(newEmail.or(dialog).first()).toBeVisible();
```

## Working with Lists

### Count Items

```typescript
await expect(page.getByRole('listitem')).toHaveCount(3);
```

### Assert All Text

```typescript
await expect(page.getByRole('listitem')).toHaveText(['apple', 'banana', 'orange']);
```

### Get Specific Item

```typescript
// By text
await page.getByText('orange').click();

// By nth (use with caution)
const banana = page.getByRole('listitem').nth(1);

// First/Last
const first = page.getByRole('listitem').first();
const last = page.getByRole('listitem').last();
```

## Strictness

Locators are strict - operations throw if more than one element matches:

```typescript
// Throws if multiple buttons exist
await page.getByRole('button').click();
```

Use `.first()`, `.last()`, or `.nth()` to opt out of strictness (not recommended).

## Best Practices

- Prioritize user-facing locators (role, text, label)
- Use `getByTestId()` when role/text are not suitable
- Avoid CSS/XPath selectors tied to DOM structure
- Use the code generator to find resilient locators
- Filter locators to uniquely identify elements
