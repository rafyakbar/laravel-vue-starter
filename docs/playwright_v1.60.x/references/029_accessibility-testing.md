# Accessibility Testing

> Source: https://playwright.dev/docs/accessibility-testing

## Background

Playwright can test your application for many types of accessibility issues including poor color contrast, missing labels on form elements, and duplicate IDs on interactive elements. The examples use the `@axe-core/playwright` package which runs the axe accessibility testing engine as part of Playwright tests.

**Important:** Automated accessibility tests can detect some common problems, but many accessibility issues require manual testing. Use a combination of automated testing, manual accessibility assessments, and inclusive user testing.

## Installation

```bash
npm install -D @axe-core/playwright
```

## Scanning an Entire Page

Test an entire page for automatically detectable accessibility violations:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('homepage', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('https://your-site.com/');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

## Scanning a Specific Part of a Page

Use `include()` to constrain a scan to a specific part:

```typescript
test('navigation menu should not have accessibility violations', async ({ page }) => {
  await page.goto('https://your-site.com/');
  await page.getByRole('button', { name: 'Navigation Menu' }).click();
  
  // Wait for the page to be in the desired state before analyze()
  await page.locator('#navigation-menu-flyout').waitFor();
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('#navigation-menu-flyout')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Scanning for WCAG Violations

Use `withTags()` to run only rules tagged for specific WCAG success criteria:

```typescript
test('should not have WCAG A or AA violations', async ({ page }) => {
  await page.goto('https://your-site.com/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

Available tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and more.

## Handling Known Issues

### Excluding Elements

Use `exclude()` to exclude elements with known issues:

```typescript
test('should not have violations outside known issues', async ({ page }) => {
  await page.goto('https://your-site.com/page-with-known-issues');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .exclude('#element-with-known-issue')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

**Note:** `exclude()` excludes the element and all descendants from all rules.

### Disabling Individual Rules

Use `disableRules()` to disable specific rules:

```typescript
test('should not have violations outside disabled rules', async ({ page }) => {
  await page.goto('https://your-site.com/page-with-known-issues');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .disableRules(['duplicate-id'])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Using Snapshots for Known Issues

Create a fingerprint of violations for snapshot comparison:

```typescript
// Don't snapshot entire violations array - it's fragile
// Instead, create a fingerprint with rule ID and targets
expect(violationFingerprints(accessibilityScanResults)).toMatchSnapshot();

// my-test-utils.js
function violationFingerprints(accessibilityScanResults) {
  const violationFingerprints = accessibilityScanResults.violations.map(violation => ({
    rule: violation.id,
    targets: violation.nodes.map(node => node.target),
  }));
  return JSON.stringify(violationFingerprints, null, 2);
}
```

## Exporting Scan Results as Attachment

Attach full scan results for debugging:

```typescript
test('example with attachment', async ({ page }, testInfo) => {
  await page.goto('https://your-site.com/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: 'application/json'
  });
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Using a Test Fixture

Create a fixture for common axe configuration:

### Creating the Fixture

```typescript
// axe-test.ts
import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('#commonly-reused-element-with-known-issue');
    await use(makeAxeBuilder);
  }
});
export { expect } from '@playwright/test';
```

### Using the Fixture

```typescript
const { test, expect } = require('./axe-test');

test('example using custom fixture', async ({ page, makeAxeBuilder }) => {
  await page.goto('https://your-site.com/');
  const accessibilityScanResults = await makeAxeBuilder()
    .include('#specific-element-under-test')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Best Practices

- Combine automated tests with manual accessibility assessments
- Use `withTags()` to focus on WCAG A and AA criteria
- Create fixtures for reusable axe configuration across tests
- Use `include()` for testing specific components or sections
- Attach scan results to test output for debugging
- Wait for page state before running `analyze()` for dynamic content
- Use Accessibility Insights for Web for comprehensive manual assessments
