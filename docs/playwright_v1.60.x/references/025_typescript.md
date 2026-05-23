# TypeScript

> Source: https://playwright.dev/docs/test-typescript

## Background

Playwright supports TypeScript out of the box. You write tests in TypeScript, and Playwright will read them, transform to JavaScript and run them. Playwright does not check types and will run tests even if there are non-critical TypeScript compilation errors.

## Type Checking

### Running TypeScript Compiler

For proper type checking, run the TypeScript compiler alongside Playwright. On GitHub Actions:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    ...
    - name: Run type checks
      run: npx tsc -p tsconfig.json --noEmit
    - name: Run Playwright tests
      run: npx playwright test
```

For local development, run `tsc` in watch mode:

```bash
npx tsc -p tsconfig.json --noEmit -w
```

## tsconfig.json

Playwright will pick up `tsconfig.json` for each source file it loads. Note that Playwright only supports the following tsconfig options: `allowJs`, `baseUrl`, `paths` and `references`.

### Separate Test Configuration

Set up a separate `tsconfig.json` in the tests directory for test-specific preferences:

```text
src/
  source.ts
tests/
  tsconfig.json  # test-specific tsconfig
  example.spec.ts
tsconfig.json  # generic tsconfig for all typescript sources
playwright.config.ts
```

### Path Mapping

Playwright supports path mapping declared in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@myhelper/*": ["packages/myhelper/*"]
    }
  }
}
```

Import using mapped paths:

```typescript
import { test, expect } from '@playwright/test';
import { username, password } from '@myhelper/credentials';

test('example', async ({ page }) => {
  await page.getByLabel('User Name').fill(username);
  await page.getByLabel('Password').fill(password);
});
```

### tsconfig Resolution

By default, Playwright looks up the closest tsconfig for each imported file by going up the directory structure. Create a `tests/tsconfig.json` file that will be used only for tests:

```bash
# Playwright will choose tsconfig automatically
npx playwright test
```

Specify a single tsconfig file via command line:

```bash
# Pass a specific tsconfig
npx playwright test --tsconfig=tsconfig.test.json
```

Specify in the config file for loading test files:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  tsconfig: './tsconfig.test.json',
});
```

## Manual Compilation

When Playwright cannot transform TypeScript code correctly (experimental or recent TypeScript features), perform manual compilation before running tests.

### Setup

Create `tsconfig.json` inside the tests directory:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "moduleResolution": "Node",
    "sourceMap": true,
    "outDir": "../tests-out",
  }
}
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "pretest": "tsc --incremental -p tests/tsconfig.json",
    "test": "playwright test -c tests-out"
  }
}
```

The `pretest` script runs TypeScript on the tests. The `test` script runs tests from the `tests-out` directory. Run with `npm run test`.

## Best Practices

- Always run TypeScript compiler with `--noEmit` for type checking alongside tests
- Use a separate `tsconfig.json` in the tests directory for test-specific settings
- Configure path mappings to simplify imports from helper modules
- Run type checks in CI before running tests to catch issues early
- Use manual compilation when working with experimental TypeScript features
