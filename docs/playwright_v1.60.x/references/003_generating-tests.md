# Generating Tests

> Source: https://playwright.dev/docs/codegen-intro

## Background

Playwright can generate tests automatically, providing a quick way to get started with testing. Codegen opens a browser window for interaction and the Playwright Inspector for recording, copying, and managing your generated tests.

## Running Codegen

Use the `codegen` command to run the test generator followed by the URL of the website you want to generate tests for. The URL is optional and can be added directly in the browser window if omitted.

```bash
npx playwright codegen demo.playwright.dev/todomvc
```

## Recording a Test

Run `codegen` and perform actions in the browser. Playwright generates code for your interactions automatically. Codegen analyzes the rendered page and recommends the best locator, prioritizing role, text, and test id locators. When multiple elements match a locator, the generator improves it to uniquely identify the target element, reducing test failures and flakiness.

### What You Can Record

- Actions like click or fill by interacting with the page
- Assertions by clicking a toolbar icon, then clicking a page element to assert against

### Assertion Types

- `'assert visibility'` - assert that an element is visible
- `'assert text'` - assert that an element contains specific text
- `'assert value'` - assert that an element has a specific value

### Finishing Recording

When you finish interacting with the page:

1. Press the `'record'` button to stop recording
2. Use the `'copy'` button to copy the generated code to your editor
3. Use the `'clear'` button to clear the code and start recording again
4. Close the Playwright Inspector window or stop the terminal command when done

## Generating Locators

You can generate locators with the test generator:

1. Press the `'Record'` button to stop recording and the `'Pick Locator'` button will appear
2. Click the `'Pick Locator'` button and hover over elements in the browser window to see the locator highlighted underneath each element
3. Click the element you want to locate and the code for that locator will appear in the locator playground next to the Pick Locator button
4. Edit the locator in the locator playground to fine-tune it and see the matching element highlighted in the browser window
5. Use the copy button to copy the locator and paste it into your code

## Emulation

You can generate tests using emulation for specific viewports, devices, color schemes, geolocation, language, or timezone. The test generator can also preserve authenticated state.

## Best Practices

- Use codegen to quickly bootstrap tests for new features
- Review generated locators for stability before committing
- Prefer role and text locators over CSS selectors
- Use assertion recording to ensure proper test validation
- Edit generated code to add meaningful test descriptions
- Leverage emulation features for cross-device testing
