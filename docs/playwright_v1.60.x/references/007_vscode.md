# VS Code Extension

> Source: https://playwright.dev/docs/getting-started-vscode

## Background

The Playwright VS Code extension brings the power of Playwright Test directly into your editor, allowing you to run, debug, and generate tests with a seamless UI-driven experience.

## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (LTS version recommended)
- Visual Studio Code

## Installation & Setup

### Step 1: Install the Extension

Open the Extensions view in VS Code (`Ctrl+Shift+X` or `Cmd+Shift+X`) and search for "Playwright". Install the official extension from Microsoft.

### Step 2: Install Playwright

Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run the Test: Install Playwright command.

### Step 3: Select Browsers

Choose the browsers you want for your tests (e.g., Chromium, Firefox, WebKit). You can also add a GitHub Actions workflow to run tests in CI. These settings can be changed later in your `playwright.config.ts` file.

### Opening the Testing Sidebar

Click the Testing icon in the VS Code Activity Bar to open the Test Explorer. Here, you'll find your tests, as well as the Playwright sidebar for managing projects, tools, and settings.

## Core Features

### Running Your Tests

**Run a Single Test:** Click the green "play" icon next to any test to run it. The play button will change to a green checkmark if the test passes or a red X if the test fails.

**Run All Tests:** Click the play icon next to a specific test file to run all tests within that file, or click the play icon at the very top of the Test Explorer to run all tests across your entire project.

**Run on Multiple Browsers:** In the Playwright sidebar, check the boxes for the projects (browsers) you want to test against. When you run a test, it will execute across all selected projects.

**Show Browser:** To watch your tests execute in a live browser window, enable the Show Browser option in the sidebar. Disable it to run in headless mode.

### Debugging Your Tests

**Using Breakpoints:** Set a breakpoint by clicking in the gutter next to a line number. Right-click the test and select Debug Test. The test will pause at your breakpoint, allowing you to inspect variables and step through the code.

**Live Debugging:** With Show Browsers enabled, click on a locator in your code. Playwright will highlight the corresponding element in the browser, making it easy to verify locators.

**Viewing Error Messages:** If a test fails, the extension displays detailed error messages, including the expected vs. received values and a full call log, directly in the editor.

**Fix with AI:** When a test fails, click the sparkle icon next to the error to get an AI-powered fix suggestion from Copilot.

**Debugging with Trace Viewer:** For comprehensive debugging, enable the Show Trace Viewer option in the Playwright sidebar. When your test finishes, a detailed trace will automatically open, providing:
- Step-by-step analysis with precise timestamps
- DOM snapshots at any point during test execution
- Network monitoring of all requests and responses
- Console logs and errors from the browser
- Source mapping to jump to source code
- Visual debugging with screenshots

### Generating Tests with CodeGen

**Record a New Test:** Click Record new in the sidebar. A browser window will open. As you interact with the page, Playwright will automatically generate the test code. You can also generate assertions from the recording toolbar.

**Record at Cursor:** Place your cursor inside an existing test and click Record at cursor to add new actions at that specific point.

**Pick a Locator:** Use the Pick locator tool to click on any element in the opened browser. Playwright will determine the best locator and copy it to your clipboard.

## Advanced Features

### Project Dependencies

Use project dependencies to define setup tests that run before other tests. For example, you can create a login test that runs first, then reuse that authenticated state across multiple tests without having to log in again for each test.

### Global Setup

For tasks that need to run only once before all tests (like seeding a database), use Global Setup. You can trigger the global setup and teardown manually from the Playwright sidebar.

### Multiple Configurations

If you have multiple `playwright.config.ts` files, you can switch between them using the gear icon in the Playwright sidebar. This allows you to easily work with different test suites or environments.

## Quick Reference

| Action | Command |
|--------|---------|
| Install Playwright | Command Palette → Test: Install Playwright |
| Run a Test | Click the "play" icon next to the test |
| Debug a Test | Set a breakpoint, right-click the test → Debug Test |
| Show Live Browser | Enable Show Browsers in the Playwright sidebar |
| Record a New Test | Click Record new in the Playwright sidebar |
| Pick a Locator | Click Pick locator in the Playwright sidebar |
| View Test Trace | Enable Show Trace Viewer in the Playwright sidebar |

## Best Practices

- Use the extension for interactive test development
- Leverage live debugging to verify locators in real-time
- Use breakpoints for complex debugging scenarios
- Enable trace viewer for comprehensive failure analysis
- Use record-at-cursor for extending existing tests
