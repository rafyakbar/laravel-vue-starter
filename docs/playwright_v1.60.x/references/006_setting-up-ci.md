# Setting Up CI

> Source: https://playwright.dev/docs/ci-intro

## Background

Playwright tests can be run on any CI provider. This guide covers running tests on GitHub using GitHub Actions.

## Setting up GitHub Actions

When installing Playwright using the VS Code extension or with `npm init playwright@latest`, you are given the option to add a GitHub Actions workflow. This creates a `playwright.yml` file inside a `.github/workflows` folder.

```yaml
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
    - uses: actions/setup-node@v5
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Workflow Steps

1. Clone your repository
2. Install Node.js
3. Install NPM Dependencies
4. Install Playwright Browsers
5. Run Playwright tests
6. Upload HTML report to the GitHub UI

## Viewing Test Logs

Click on the Actions tab to see the workflows. Clicking on the workflow run shows you all the actions that GitHub performed. Clicking on "Run Playwright tests" shows the error messages, what was expected and what was received as well as the call log.

## HTML Report

### Downloading the Report

In the Artifacts section, click on the playwright-report to download your report in the format of a zip file.

### Viewing the Report

Locally opening the report does not work as expected as you need a web server for everything to work correctly. First, extract the zip, preferably in a folder that already has Playwright installed.

```bash
npx playwright show-report name-of-my-extracted-playwright-report
```

## Viewing the Trace

Once you have served the report, click on the trace icon next to the test's file name. You can then view the trace of your tests and inspect each action to find out why the tests are failing.

## Publishing Report on the Web

You can utilize Azure Storage's static websites hosting capabilities to serve HTML reports on the Internet.

### Setup Steps

1. Create an Azure Storage account
2. Enable Static website hosting for the storage account
3. Create a Service Principal in Azure and grant it access to Azure Blob storage
4. Use the credentials to set up encrypted secrets in your GitHub repository
5. Add a step that uploads the HTML report to Azure Storage

## Handling Secrets

Artifacts like trace files, HTML reports or even the console logs contain information about your test execution. They can contain sensitive data like user credentials for a test user, access tokens to a staging backend, testing source code, or sometimes even your application source code.

Treat these files just as carefully as you treat that sensitive data. If you upload reports and traces as part of your CI workflow, make sure that you only upload them to trusted artifact stores, or that you encrypt the files before upload.

## Best Practices

- Always use `--with-deps` when installing browsers on CI
- Set appropriate timeout values for your test suite
- Use `!cancelled()` to upload artifacts even on failure
- Configure proper retention days for reports
- Protect sensitive data in reports and traces
- Use matrix strategies for cross-browser testing
