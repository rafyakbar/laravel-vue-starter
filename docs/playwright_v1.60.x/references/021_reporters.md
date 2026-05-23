# Reporters

> Source: https://playwright.dev/docs/test-reporters

## Background

Playwright Test comes with built-in reporters and supports custom reporters. Reporters can be specified via command line or configuration file.

## Command Line

```bash
npx playwright test --reporter=line
```

## Configuration

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'line',
});
```

## Multiple Reporters

```typescript
export default defineConfig({
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
  ],
});
```

## Built-in Reporters

### List Reporter (Default)

Prints a line for each test being run:

```bash
npx playwright test --reporter=list
```

### Line Reporter

More concise, uses a single line to report the last finished test:

```bash
npx playwright test --reporter=line
```

### Dot Reporter

Very concise - a single character per test (default on CI):

```bash
npx playwright test --reporter=dot
```

| Character | Meaning |
|-----------|---------|
| `·` | Passed |
| `F` | Failed |
| `×` | Failed and will be retried |
| `±` | Passed on retry (flaky) |
| `T` | Timed out |
| `°` | Skipped |

### HTML Reporter

Produces a self-contained folder with the report:

```bash
npx playwright test --reporter=html
```

```typescript
export default defineConfig({
  reporter: [['html', { open: 'never' }]],
});
```

Open the report:

```bash
npx playwright show-report
npx playwright show-report my-report
```

### Blob Reporter

Contains all details about the test run for merging sharded reports:

```typescript
export default defineConfig({
  reporter: 'blob',
});
```

### JSON Reporter

Produces a JSON object with all test run information:

```bash
PLAYWRIGHT_JSON_OUTPUT_NAME=results.json npx playwright test --reporter=json
```

### JUnit Reporter

Produces a JUnit-style XML report:

```bash
PLAYWRIGHT_JUNIT_OUTPUT_NAME=results.xml npx playwright test --reporter=junit
```

### GitHub Actions Reporter

Provides automatic failure annotations in GitHub Actions:

```typescript
export default defineConfig({
  reporter: process.env.CI ? 'github' : 'list',
});
```

## Custom Reporters

Implement a class with reporter methods:

```typescript
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult
} from '@playwright/test/reporter';

class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test ${test.title}: ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log(`Finished the run: ${result.status}`);
  }
}

export default MyReporter;
```

Use the custom reporter:

```typescript
export default defineConfig({
  reporter: './my-awesome-reporter.ts',
});
```

## Best Practices

- Use `dot` reporter on CI for concise output
- Use `html` reporter for detailed local debugging
- Use `blob` reporter when sharding tests
- Combine multiple reporters as needed
- Create custom reporters for specialized needs
