# Migrating from Protractor

> Source: https://playwright.dev/docs/protractor

## Background

Protractor is deprecated, and Playwright Test provides a modern alternative with cross-browser support, auto-waiting, and powerful debugging tools. Migration is straightforward with similar locator concepts and cleaner APIs.

## Migration Principles

- No need for `webdriver-manager` or Selenium
- Protractor's `ElementFinder` maps to Playwright's `Locator`
- `waitForAngular` is replaced by auto-waiting
- Remember to use `await` in Playwright

## API Mapping Cheat Sheet

| Protractor | Playwright |
|------------|------------|
| `element(by.buttonText('...'))` | `page.locator('button, input[type="button"], input[type="submit"] >> text="..."')` |
| `element(by.css('...'))` | `page.locator('...')` |
| `element(by.cssContainingText('..1..', '..2..'))` | `page.locator('..1.. >> text=..2..')` |
| `element(by.id('...'))` | `page.locator('#...')` |
| `element(by.model('...'))` | `page.locator('[ng-model="..."]')` |
| `element(by.repeater('...'))` | `page.locator('[ng-repeat="..."]')` |
| `element(by.xpath('...'))` | `page.locator('xpath=...')` |
| `element.all` | `page.locator` |
| `browser.get(url)` | `await page.goto(url)` |
| `browser.getCurrentUrl()` | `page.url()` |

## Migration Example

### Protractor

```typescript
describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('https://angularjs.org');
    element(by.model('todoList.todoText')).sendKeys('first test');
    element(by.css('[value="add"]')).click();
    
    const todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('first test');
    
    todoList.get(2).element(by.css('input')).click();
    const completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2);
  });
});
```

### Playwright Test

```typescript
const { test, expect } = require('@playwright/test');

test.describe('angularjs homepage todo list', () => {
  test('should add a todo', async ({ page }) => {
    await page.goto('https://angularjs.org');
    await page.locator('[ng-model="todoList.todoText"]').fill('first test');
    await page.locator('[value="add"]').click();
    
    const todoList = page.locator('[ng-repeat="todo in todoList.todos"]');
    await expect(todoList).toHaveCount(3);
    await expect(todoList.nth(2)).toHaveText('first test', { useInnerText: true });
    
    await todoList.nth(2).getByRole('textbox').click();
    const completedAmount = page.locator('.done-true');
    await expect(completedAmount).toHaveCount(2);
  });
});
```

## Key Migration Notes

1. Import `test` and `expect` from `@playwright/test`
2. Mark test functions as `async`
3. Receive `page` as a test parameter (fixture)
4. Prefix most Playwright calls with `await`
5. Use web-first assertions like `expect(locator).toHaveText()`

## Polyfilling waitForAngular

For edge cases where you need Angular synchronization:

```typescript
async function waitForAngular(page) {
  await page.evaluate(async () => {
    if (window.getAllAngularTestabilities) {
      await Promise.all(window.getAllAngularTestabilities().map(whenStable));
      
      async function whenStable(testability) {
        return new Promise(res => testability.whenStable(res));
      }
    }
  });
}
```

## Playwright Test Advantages

- Full TypeScript support with zero configuration
- Cross-browser testing (Chrome, Firefox, Safari)
- Support for multiple origins, iframes, tabs, and contexts
- Parallel test execution with isolation
- Built-in artifact collection (traces, screenshots, videos)
- Playwright Inspector for debugging
- Code generation for test creation
- Tracing for post-mortem debugging

## Best Practices

- Use locators instead of element handles
- Leverage web-first assertions for reliability
- Trust auto-waiting instead of explicit waits
- Use `test.describe` for grouping tests
- Configure projects for cross-browser testing
- Enable tracing for debugging failed tests
