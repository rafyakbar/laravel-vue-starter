# Command Line

> Source: https://playwright.dev/docs/test-cli

## Background

Playwright provides a powerful command line interface for running tests, generating code, debugging, and more.

## Essential Commands

### Run Tests

```bash
# Run all tests
npx playwright test

# Run a single test file
npx playwright test tests/todo-page.spec.ts

# Run tests at a specific line
npx playwright test my-spec.ts:42

# Run tests by title
npx playwright test -g "add a todo item"

# Run tests in headed browsers
npx playwright test --headed

# Run tests for a specific project
npx playwright test --project=chromium
```

### Common Options

| Option | Description |
|--------|-------------|
| `--debug` | Run tests with Playwright Inspector |
| `--headed` | Run tests in headed browsers |
| `-g <grep>` | Only run tests matching this regex |
| `--project <name>` | Run tests from specified projects |
| `--ui` | Run tests in interactive UI mode |
| `-j <workers>` | Number of concurrent workers |

### Disable Parallelization

```bash
npx playwright test --workers=1
```

### Debug Mode

```bash
npx playwright test --debug
```

### UI Mode

```bash
npx playwright test --ui
```

## Show Report

Display HTML report from previous test run:

```bash
# Show latest test report
npx playwright show-report

# Show a specific report
npx playwright show-report playwright-report/

# Show report on custom port
npx playwright show-report --port 8080
```

## Install Browsers

```bash
# Install all browsers
npx playwright install

# Install only Chromium
npx playwright install chromium

# Install browsers with dependencies
npx playwright install --with-deps
```

## Code Generation

Record actions and generate tests:

```bash
# Start recording with interactive UI
npx playwright codegen

# Record on specific site
npx playwright codegen https://playwright.dev

# Generate Python code
npx playwright codegen --target=python
```

## Trace Viewer

Analyze and view test traces:

```bash
# Open trace viewer
npx playwright show-trace

# View a trace file
npx playwright show-trace trace.zip
```

## Merge Reports

Combine blob reports:

```bash
npx playwright merge-reports ./reports
```

## Test List

The `--test-list` option accepts a file with tests to run:

```
# This is a test list file
path/to/example.spec.ts
[chromium] › path/to/example.spec.ts
path/to/example.spec.ts › suite name
```

## Best Practices

- Use `--workers=1` for debugging flaky tests
- Use `--debug` for interactive debugging with Playwright Inspector
- Use `--last-failed` to re-run only failing tests
- Use `--only-changed` to run only modified test files
