# Continuous Integration

> Source: https://playwright.dev/docs/ci

## Background

Playwright tests integrate seamlessly with CI platforms. This guide covers configuration for major CI providers with best practices for reliable test execution.

## Getting Started

Three steps to run tests on CI:

1. Ensure CI agents can run browsers
2. Install Playwright dependencies
3. Run tests

```bash
# Install dependencies
npm ci

# Install Playwright browsers and system dependencies
npx playwright install --with-deps

# Run tests
npx playwright test
```

## Worker Configuration

Set workers to 1 in CI for stability:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
});
```

For powerful self-hosted CI, enable parallel tests or use sharding.

## GitHub Actions

### Basic Configuration

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v6
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v5
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Container-Based

```yaml
jobs:
  playwright:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.60.0-noble
      options: --user 1001
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
      - name: Install dependencies
        run: npm ci
      - name: Run your tests
        run: npx playwright test
```

### On Deployment

Run tests after deployment success:

```yaml
on: deployment_status
jobs:
  test:
    if: github.event.deployment_status.state == 'success'
    steps:
      - name: Run Playwright tests
        env:
          PLAYWRIGHT_TEST_BASE_URL: ${{ github.event.deployment_status.target_url }}
```

## Azure Pipelines

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: UseNode@1
  inputs:
    version: '22'
  displayName: 'Install Node.js'
- script: npm ci
  displayName: 'npm ci'
- script: npx playwright install --with-deps
  displayName: 'Install Playwright browsers'
- script: npx playwright test
  displayName: 'Run Playwright tests'
  env:
    CI: 'true'
```

## CircleCI

```yaml
executors:
  pw-noble-development:
    docker:
      - image: mcr.microsoft.com/playwright:v1.60.0-noble
```

## GitLab CI

```yaml
stages:
  - test

tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.60.0-noble
  script:
    - npm ci
    - npx playwright test
```

### Sharding

```yaml
tests:
  parallel: 7
  script:
    - npm ci
    - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
```

## Jenkins

```groovy
pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v1.60.0-noble' } }
   stages {
      stage('e2e-tests') {
         steps {
            sh 'npm ci'
            sh 'npx playwright test'
         }
      }
   }
}
```

## Bitbucket Pipelines

```yaml
image: mcr.microsoft.com/playwright:v1.60.0-noble
```

## Sharding Across Machines

Distribute tests across multiple CI jobs:

```bash
# Shard 1 of 4
npx playwright test --shard=1/4
```

## Caching Browsers

Browser caching is not recommended - download time is comparable to cache restore, and OS dependencies aren't cacheable.

## Debugging Launch Failures

Enable debug logging:

```bash
DEBUG=pw:browser npx playwright test
```

## Running Headed

On Linux agents, use xvfb for headed execution:

```bash
xvfb-run npx playwright test
```

## Best Practices

- Use Docker images for consistent environments
- Set workers to 1 for stability in shared environments
- Upload test artifacts (reports, traces) for debugging
- Use sharding for large test suites
- Run visual regression tests in containers for consistency
- Configure timeouts appropriately for CI resources
