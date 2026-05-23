# Page Object Models

> Source: https://playwright.dev/docs/pom

## Background

Page Object Models (POM) organize test suites by representing parts of a web application as classes. Each page object encapsulates element selectors and common operations, simplifying test authoring and maintenance by centralizing selector logic and creating reusable code.

## Implementation

Create a page object class that wraps the `page` object and exposes high-level methods:

```typescript
// playwright-dev-page.ts
import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightDevPage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly gettingStartedHeader: Locator;
  readonly pomLink: Locator;
  readonly tocList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    this.pomLink = page.locator('li', {
      hasText: 'Guides',
    }).locator('a', {
      hasText: 'Page Object Model',
    });
    this.tocList = page.locator('article div.markdown ul > li > a');
  }

  async goto() {
    await this.page.goto('https://playwright.dev');
  }

  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }

  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }
}
```

## Using Page Objects in Tests

Import and instantiate page objects in your test files:

```typescript
// example.spec.ts
import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from './playwright-dev-page';

test('getting started should contain table of contents', async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.getStarted();
  await expect(playwrightDev.tocList).toHaveText([
    'How to install Playwright',
    "What's installed",
    'How to run the example test',
    'How to open the HTML test report',
    'Write tests using web-first assertions, fixtures and locators',
    'Run single or multiple tests; headed mode',
    'Generate tests with Codegen',
    'View a trace of your tests',
  ]);
});

test('should show Page Object Model article', async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.pageObjectModel();
  await expect(page.locator('article')).toContainText('Page Object Model is a common pattern');
});
```

## Benefits

- **Simplified authoring**: Higher-level API tailored to your application
- **Easier maintenance**: Element selectors captured in one place
- **Code reuse**: Avoid repetition across tests
- **Self-documenting**: Page object methods describe user actions

## Best Practices

- Define locators as class properties in the constructor
- Create methods for common user workflows, not just single actions
- Use TypeScript for type safety and better IDE support
- Keep page objects focused on single pages or components
- Avoid assertions inside page objects - let tests handle verification
- Use meaningful method names that describe user intentions
- Consider composition for complex pages with reusable components
