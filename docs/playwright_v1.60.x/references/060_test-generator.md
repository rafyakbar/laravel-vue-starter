# Test Generator

> Source: https://playwright.dev/docs/codegen

## Background

Playwright's test generator (Codegen) automatically creates tests by recording your browser interactions. It generates code using recommended patterns and best practices, making it easy to create robust tests without writing code manually.

## Starting Codegen

Launch the test generator:

```bash
npx playwright codegen
```

Open a specific URL:

```bash
npx playwright codegen https://example.com
```

## Recording Tests

1. Run `npx playwright codegen` to open the Playwright Inspector
2. Perform actions in the browser window
3. Code is generated in the Inspector panel
4. Copy the generated code to your test file

## Generated Code

Codegen produces clean, maintainable code:

```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByRole('link', { name: 'Get Started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

## Emulation

Record tests with device emulation:

```bash
# Emulate a specific device
npx playwright codegen --device="iPhone 13" https://example.com
```

## Viewport and Language

Customize the recording environment:

```bash
# Set viewport size
npx playwright codegen --viewport-size=1280,720

# Generate Python instead of JavaScript
npx playwright codegen --target=python https://example.com
```

## Assertion Recording

Record assertions using the assertion toolbar:

1. Click the assertion button in the Inspector
2. Click an element to assert its state
3. Choose assertion type (visible, text, value, etc.)

```typescript
// Generated assertion
await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('');
```

## Locator Selection

Codegen prioritizes user-visible locators:

- `getByRole()` for accessible elements
- `getByText()` for text content
- `getByLabel()` for form fields
- `getByTestId()` when test IDs exist

## Output Targets

Generate tests for different frameworks:

```bash
# JavaScript/TypeScript (default)
npx playwright codegen --target=test

# Library mode (no test runner)
npx playwright codegen --target=library

# Python
npx playwright codegen --target=python

# C#
npx playwright codegen --target=csharp

# Java
npx playwright codegen --target=java
```

## Best Practices

- Review and clean up generated code before committing
- Replace generated selectors with semantic locators when possible
- Add meaningful test descriptions instead of default names
- Use the Inspector to explore locators during test development
- Combine codegen with manual refinement for best results
- Run generated tests immediately to verify they work
