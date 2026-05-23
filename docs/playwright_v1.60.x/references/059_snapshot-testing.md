# Snapshot Testing

> Source: https://playwright.dev/docs/aria-snapshots

## Background

Snapshot testing with Playwright asserts the accessibility tree of a page against a predefined YAML template. This approach captures the hierarchical structure of accessible elements, providing a holistic way to verify page state and structure.

## Aria Snapshots

Aria snapshots use YAML format to represent the accessibility tree:

```typescript
await page.goto('https://playwright.dev/');
await expect(page).toMatchAriaSnapshot(`
  - banner:
    - heading /Playwright enables reliable end-to-end/ [level=1]
    - link "Get started":
      - /url: /docs/intro
    - link "Star microsoft/playwright on GitHub":
      - /url: https://github.com/microsoft/playwright
    - link /[\\d]+k\\+ stargazers on GitHub/
`);
```

## Snapshot Syntax

Each accessible element is represented as:

```yaml
- role "name" [attribute=value]
```

- **role**: ARIA or HTML role (e.g., `heading`, `button`, `list`)
- **"name"**: Accessible name (quoted for exact, `/pattern/` for regex)
- **[attribute=value]**: ARIA attributes like `checked`, `disabled`, `level`

### Examples

```yaml
# Heading with level
- heading "Title" [level=1]

# Text node
- text: Sample accessible name

# Link with URL
- link "Read more":
  - /url: "#more-info"

# Checkbox with state
- checkbox [checked]

# List with items
- list "Main Features":
  - listitem: Feature 1
  - listitem: Feature 2
```

## Matching Modes

### Partial Matching

Omit attributes or names for flexible matching:

```typescript
// Match any button, ignoring the label
await expect(page).toMatchAriaSnapshot(`- button`);

// Match checkbox, ignoring checked state
await expect(page).toMatchAriaSnapshot(`- checkbox`);
```

### Strict Matching

Control child matching with `/children` property:

```yaml
- list:
  - /children: equal  # Must match exactly
  - listitem: Feature A
  - listitem: Feature B
```

Options:
- `contain` (default): All specified children present in order
- `equal`: Children exactly match in order
- `deep-equal`: Children and nested children match exactly

### Global Configuration

Set default matching mode in config:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toMatchAriaSnapshot: {
      children: 'equal',
    },
  },
});
```

## Regular Expressions

Match dynamic content with regex patterns:

```typescript
await expect(page).toMatchAriaSnapshot(`
  - heading /Issues \\d+/
`);
```

## Generating Snapshots

### Empty Template

Pass an empty string to generate a snapshot:

```typescript
await expect(locator).toMatchAriaSnapshot('');
```

### Update Snapshots

Use the `--update-snapshots` flag to update baselines:

```bash
npx playwright test --update-snapshots
```

### Separate Files

Store snapshots in dedicated `.aria.yml` files:

```typescript
await expect(page.getByRole('main')).toMatchAriaSnapshot({
  name: 'main.aria.yml'
});
```

### Programmatic Access

Get the YAML representation directly:

```typescript
const snapshot = await page.ariaSnapshot();
console.log(snapshot);
```

## Assertion Testing vs Snapshot Testing

### Snapshot Testing Best For
- UI testing of whole pages and components
- Broad structural checks
- Regression testing for stable structures

### Assertion Testing Best For
- Core logic validation
- Computed value testing
- Fine-grained specific conditions

## Best Practices

- Combine with assertion testing for comprehensive coverage
- Use partial matching for flexible, resilient tests
- Store snapshots in separate files for large structures
- Review snapshot changes carefully before accepting
- Set appropriate `--timeout` when generating snapshots
- Use regex for dynamic but predictable content
