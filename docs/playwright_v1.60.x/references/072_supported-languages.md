# Supported Languages

> Source: https://playwright.dev/docs/languages

## Background

Playwright is available in multiple programming languages, all sharing the same underlying implementation. Each language binding provides full access to Playwright's browser automation capabilities, with different testing ecosystem integrations.

## JavaScript and TypeScript

Playwright for Node.js includes its own test runner with parallelization, screenshot assertions, HTML reporter, and automatic tracing.

```typescript
import { test, expect } from '@playwright/test';

test('example', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});
```

- **Documentation**: https://playwright.dev/docs/intro
- **GitHub**: https://github.com/microsoft/playwright
- **Test Runner**: Built-in with zero configuration

## Python

Playwright for Python includes a Pytest plugin for context isolation and multi-browser testing out of the box.

```python
from playwright.sync_api import Page, expect

def test_example(page: Page):
    page.goto("https://example.com")
    expect(page.locator("h1")).to_be_visible()
```

- **Documentation**: https://playwright.dev/python/docs/intro
- **GitHub**: https://github.com/microsoft/playwright-python
- **Test Runner**: Pytest plugin included

## Java

Playwright for Java integrates with popular testing frameworks like JUnit and TestNG.

```java
import com.microsoft.playwright.*;

public class ExampleTest {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();
            page.navigate("https://example.com");
            System.out.println(page.title());
            browser.close();
        }
    }
}
```

- **Documentation**: https://playwright.dev/java/docs/intro
- **GitHub**: https://github.com/microsoft/playwright-java
- **Test Runner**: JUnit, TestNG, or any framework

## .NET

Playwright for .NET provides base classes for MSTest, NUnit, xUnit, and xUnit v3.

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class ExampleTest : PageTest
{
    [Test]
    public async Task Example()
    {
        await Page.GotoAsync("https://example.com");
        await Expect(Page.Locator("h1")).ToBeVisibleAsync();
    }
}
```

- **Documentation**: https://playwright.dev/dotnet/docs/intro
- **GitHub**: https://github.com/microsoft/playwright-dotnet
- **Test Runner**: MSTest, NUnit, xUnit support

## Choosing a Language

Select based on:
- **Team expertise**: Use languages your team knows well
- **Testing ecosystem**: Consider test runner preferences
- **Project constraints**: Match existing project languages
- **CI/CD integration**: Ensure tooling compatibility

## Feature Parity

All language bindings support:
- Cross-browser testing (Chromium, Firefox, WebKit)
- Auto-waiting and retry-ability
- Network interception and mocking
- Screenshot and video capture
- Trace viewer for debugging
- Device emulation

## Best Practices

- Use the recommended test runner for each language
- Leverage language-specific testing patterns
- Consider team familiarity when choosing
- Maintain consistent patterns across test files
- Use the official documentation for each binding
