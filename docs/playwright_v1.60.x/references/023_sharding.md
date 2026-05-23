# Sharding

> Source: https://playwright.dev/docs/test-sharding

## Background

Sharding splits your tests into smaller parts that can run independently on multiple machines simultaneously, speeding up test execution in CI pipelines.

## Sharding Tests Between Multiple Machines

Use `--shard=x/y` to split the suite:

```bash
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

Each shard runs one-fourth of the tests. Running these in parallel on different jobs makes the suite complete four times faster.

## Balancing Shards

### With fullyParallel: true

Tests are split at the individual test level for more balanced shard execution. This is the preferred mode.

### Without fullyParallel

Tests are split at the file level. If test files are not evenly sized, some shards may run more tests than others.

**Recommendation:** Use `fullyParallel: true` for balanced distribution.

## Merging Reports from Multiple Shards

### Step 1: Add blob reporter

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  reporter: process.env.CI ? 'blob' : 'html',
});
```

### Step 2: Upload blob reports as artifacts

```yaml
# .github/workflows/playwright.yml
- name: Upload blob report
  if: ${{ !cancelled() }}
  uses: actions/upload-artifact@v4
  with:
    name: blob-report-${{ matrix.shardIndex }}
    path: blob-report
    retention-days: 1
```

### Step 3: Merge reports

```bash
npx playwright merge-reports --reporter html ./all-blob-reports
```

## GitHub Actions Example

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, master]
jobs:
  playwright-tests:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v5
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
    - name: Upload blob report
      if: ${{ !cancelled() }}
      uses: actions/upload-artifact@v4
      with:
        name: blob-report-${{ matrix.shardIndex }}
        path: blob-report
        retention-days: 1

  merge-reports:
    if: ${{ !cancelled() }}
    needs: [playwright-tests]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v5
    - name: Install dependencies
      run: npm ci
    - name: Download blob reports
      uses: actions/download-artifact@v5
      with:
        path: all-blob-reports
        pattern: blob-report-*
        merge-multiple: true
    - name: Merge into HTML Report
      run: npx playwright merge-reports --reporter html ./all-blob-reports
    - name: Upload HTML report
      uses: actions/upload-artifact@v4
      with:
        name: html-report
        path: playwright-report
        retention-days: 14
```

## Merging Reports from Multiple Environments

Tag tests with environment name for proper merging:

```typescript
export default defineConfig({
  reporter: process.env.CI ? 'blob' : 'html',
  tag: process.env.CI_ENVIRONMENT_NAME,
});
```

## Best Practices

- Use `fullyParallel: true` for balanced shard distribution
- Keep blob reports for debugging failed shards
- Merge reports in a separate job after all shards complete
- Use `fail-fast: false` to run all shards even if some fail
- Tag reports when running against multiple environments
