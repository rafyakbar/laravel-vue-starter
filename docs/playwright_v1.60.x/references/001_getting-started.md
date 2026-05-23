# Getting Started with Playwright

> Source: https://playwright.dev/docs/intro

## Background

Playwright Test is an end-to-end test framework for modern web apps. It bundles test runner, assertions, isolation, parallelization and rich tooling. Playwright supports Chromium, WebKit and Firefox on Windows, Linux and macOS, locally or in CI, headless or headed, with native mobile emulation for Chrome (Android) and Mobile Safari.

## Installation

### Using npm, yarn or pnpm

The command below either initializes a new project or adds Playwright to an existing one.

```bash
npm init playwright@latest
```

When prompted, choose:
- TypeScript or JavaScript (default: TypeScript)
- Tests folder name (default: `tests`, or `e2e` if `tests` already exists)
- Add a GitHub Actions workflow (recommended for CI)
- Install Playwright browsers (default: yes)

You can re-run the command later; it does not overwrite existing tests.

### Using VS Code Extension

You can also create and run tests with the VS Code Extension.

## What Gets Installed

Playwright downloads required browser binaries and creates the scaffold below:

```text
playwright.config.ts          # Test configuration
package.json
package-lock.json             # Or yarn.lock / pnpm-lock.yaml
tests/
  example.spec.ts             # Minimal example test
```

The `playwright.config` centralizes configuration: target browsers, timeouts, retries, projects, reporters and more. In existing projects dependencies are added to your current `package.json`.

## Running the Example Test

By default tests run headless in parallel across Chromium, Firefox and WebKit (configurable in `playwright.config`). Output and aggregated results display in the terminal.

```bash
npx playwright test
```

### Useful CLI Options

- See the browser window: add `--headed`
- Run a single project/browser: `--project=chromium`
- Run one file: `npx playwright test tests/example.spec.ts`
- Open testing UI: `--ui`

## HTML Test Reports

After a test run, the HTML Reporter provides a dashboard filterable by the browser, passed, failed, skipped, flaky and more. Click a test to inspect errors, attachments and steps.

```bash
npx playwright show-report
```

The report auto-opens only when failures occur; open manually with the command above.

## Running Tests in UI Mode

Run tests with UI Mode for watch mode, live step view, time travel debugging and more.

```bash
npx playwright test --ui
```

## Updating Playwright

Update Playwright and download new browser binaries and their dependencies:

```bash
npm install -D @playwright/test@latest
npx playwright install --with-deps
```

Check your installed version:

```bash
npx playwright --version
```

## System Requirements

- Node.js: latest 20.x, 22.x or 24.x
- Windows 11+, Windows Server 2019+ or Windows Subsystem for Linux (WSL)
- macOS 14 (Sonoma) or later
- Debian 12 / 13, Ubuntu 22.04 / 24.04 (x86-64 or arm64)

## Best Practices

- Always use the latest stable Node.js version supported
- Install browser dependencies with `--with-deps` on Linux systems
- Keep Playwright and browser binaries updated together
- Use the VS Code extension for enhanced development experience
- Configure GitHub Actions workflow for CI integration during setup
