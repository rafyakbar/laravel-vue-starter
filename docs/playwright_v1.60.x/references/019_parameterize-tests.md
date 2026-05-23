# Parameterize Tests

> Source: https://playwright.dev/docs/test-parameterize

## Background

You can parameterize tests on a test level or on a project level to run the same tests with different configurations.

## Parameterized Tests

Use `forEach` to run tests with different data:

```typescript
[
  { name: 'Alice', expected: 'Hello, Alice!' },
  { name: 'Bob', expected: 'Hello, Bob!' },
  { name: 'Charlie', expected: 'Hello, Charlie!' },
].forEach(({ name, expected }) => {
  test(`testing with ${name}`, async ({ page }) => {
    await page.goto(`https://example.com/greet?name=${name}`);
    await expect(page.getByRole('heading')).toHaveText(expected);
  });
});
```

### Before and After Hooks

Put hooks outside of `forEach` to execute just once:

```typescript
test.beforeEach(async ({ page }) => {
  // ...
});

test.afterEach(async ({ page }) => {
  // ...
});

[{ name: 'Alice', expected: 'Hello, Alice!' }].forEach(({ name, expected }) => {
  test(`testing with ${name}`, async ({ page }) => {
    // ...
  });
});
```

## Parameterized Projects

Create custom options and configure them per project:

```typescript
// my-test.ts
import { test as base } from '@playwright/test';

export type TestOptions = {
  person: string;
};

export const test = base.extend<TestOptions>({
  person: ['John', { option: true }],
});
```

```typescript
// example.spec.ts
import { test } from './my-test';

test('test 1', async ({ page, person }) => {
  await page.goto(`/index.html`);
  await expect(page.locator('#node')).toContainText(person);
});
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import type { TestOptions } from './my-test';

export default defineConfig<TestOptions>({
  projects: [
    { name: 'alice', use: { person: 'Alice' } },
    { name: 'bob', use: { person: 'Bob' } },
  ],
});
```

## Passing Environment Variables

Pass secrets from command line:

```typescript
test('example test', async ({ page }) => {
  await page.getByLabel('User Name').fill(process.env.USER_NAME);
  await page.getByLabel('Password').fill(process.env.PASSWORD);
});
```

```bash
USER_NAME=me PASSWORD=secret npx playwright test
```

## .env Files

Use `dotenv` package for easier environment management:

```typescript
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  use: {
    baseURL: process.env.STAGING === '1' 
      ? 'http://staging.example.test/' 
      : 'http://example.test/',
  },
});
```

## Create Tests via CSV File

Read CSV files and generate tests:

```typescript
import fs from 'fs';
import path from 'path';
import { test } from '@playwright/test';
import { parse } from 'csv-parse/sync';

const records = parse(fs.readFileSync(path.join(__dirname, 'input.csv')), {
  columns: true,
  skip_empty_lines: true,
});

for (const record of records) {
  test(`foo: ${record.test_case}`, async ({ page }) => {
    console.log(record.test_case, record.some_value, record.some_other_value);
  });
}
```

## Best Practices

- Use parameterized projects for different configurations (browsers, environments)
- Use `forEach` for data-driven tests
- Keep secrets in environment variables, not in code
- Use `.env` files for local development
- Use CSV files for large test datasets
