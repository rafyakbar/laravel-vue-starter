# Running Tests

> Source: https://playwright.dev/docs/running-tests

## Background

With Playwright you can run a single test, a set of tests, or all tests. Tests can be run on one browser or multiple browsers using the `--project` flag. Tests run in parallel by default and in headless mode, meaning no browser window opens while running the tests and results appear in the terminal.

## Running Tests

### Command Line

Run your tests with the `playwright test` command. This runs your tests on all browsers as configured in the `playwright.config` file, and results appear in the terminal. Tests run in headless mode by default.

```bash
npx playwright test
```

### Run Tests in UI Mode

Run tests with UI Mode for a better developer experience where you can easily walk through each step of the test and visually see what was happening before, during and after each step. UI mode also comes with many other features such as the locator picker, watch mode and more.

```bash
npx playwright test --ui
```

### Run Tests in Headed Mode

To run your tests in headed mode, use the `--headed` flag. This gives you the ability to visually see how Playwright interacts with the website.

```bash
npx playwright test --headed
```

### Run Tests on Different Browsers

To specify which browser you would like to run your tests on, use the `--project` flag followed by the browser name.

```bash
npx playwright test --project webkit
```

To specify multiple browsers:

```bash
npx playwright test --project webkit --project firefox
```

### Run Specific Tests

To run a single test file:

```bash
npx playwright test landing-page.spec.ts
```

To run a set of test files from different directories:

```bash
npx playwright test tests/todo-page/ tests/landing-page/
```

To run files that have `landing` or `login` in the file name:

```bash
npx playwright test landing login
```

To run a test with a specific title:

```bash
npx playwright test -g "add a todo item"
```

### Run Last Failed Tests

To run only the tests that failed in the last test run:

```bash
npx playwright test --last-failed
```

### Run Tests in VS Code

Tests can be run right from VS Code using the VS Code extension. Once installed you can simply click the green triangle next to the test you want to run or run all tests from the testing sidebar.

## Debugging Tests

### Debug Tests in UI Mode

Debug tests with UI Mode for a better developer experience where you can easily walk through each step of the test, see logs, errors, network requests, inspect the DOM snapshot, and more.

While debugging you can use the Pick Locator button to select an element on the page and see the locator that Playwright would use to find that element. You can also edit the locator in the locator playground and see it highlighting live in the browser window.

```bash
npx playwright test --ui
```

### Debug Tests with the Playwright Inspector

To debug all tests, run the Playwright test command followed by the `--debug` flag.

```bash
npx playwright test --debug
```

This command opens a browser window as well as the Playwright Inspector. You can use the step over button at the top of the inspector to step through your test. Or, press the play button to run your test from start to finish.

To debug one test file:

```bash
npx playwright test example.spec.ts --debug
```

To debug a specific test from the line number:

```bash
npx playwright test example.spec.ts:10 --debug
```

## Test Reports

The HTML Reporter shows you a full report of your tests allowing you to filter the report by browsers, passed tests, failed tests, skipped tests, and flaky tests. By default, the HTML report opens automatically if some tests failed.

```bash
npx playwright show-report
```

You can filter and search for tests as well as click on each test to see the test errors and explore each step of the test.

## Best Practices

- Use UI mode during development for interactive debugging
- Run headed mode when tests fail unexpectedly
- Use `--last-failed` to quickly iterate on fixing broken tests
- Leverage the HTML reporter for detailed failure analysis
- Filter tests by file or test name for faster feedback cycles
