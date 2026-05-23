# UI Mode

> Source: https://playwright.dev/docs/test-ui-mode

## Background

UI Mode lets you explore, run, and debug tests with a time travel experience complete with watch mode. All test files are displayed in the testing sidebar, allowing you to expand each file and describe block to individually run, view, watch, and debug each test.

## Opening UI Mode

To open UI mode:

```bash
npx playwright test --ui
```

## Running Tests

Once UI Mode launches, you see a list of all test files. Run all tests by clicking the triangle icon in the sidebar. Run a single test file, block of tests, or individual test by hovering over the name and clicking the triangle next to it.

## Filtering Tests

Filter tests by:
- Text or `@tag`
- Passed, failed, or skipped tests
- Projects as set in `playwright.config` file

If using project dependencies, run setup tests first before running tests that depend on them. UI Mode will not automatically run setup tests.

## Timeline View

At the top of the trace, see a timeline view with different colors highlighting navigation and actions. Hover back and forth to see image snapshots for each action. Double-click an action to see its time range. Use the slider to increase actions selected - these show in the Actions tab and console/network logs filter to show only logs for selected actions.

## Actions Tab

The Actions tab shows:
- What locator was used for every action
- How long each action took to run

Hover over each action to visually see the change in the DOM snapshot. Go back and forward in time, click an action to inspect and debug. Use Before and After tabs to visually see what happened before and after the action.

## Pop Out DOM Snapshot

Pop out the DOM snapshot into its own window for better debugging by clicking the pop out icon above the DOM snapshot. From there, open browser DevTools and inspect HTML, CSS, Console, etc. Go back to UI Mode and click another action to pop that out for side-by-side comparison.

## Pick Locator

Click the pick locator button and hover over the DOM snapshot to see the locator for each element highlighted. Click an element to add the locator to the playground. Modify the locator and see if it matches any locators in the DOM snapshot. Use the copy button to copy the locator and paste it into your test.

## Source Panel

As you hover over each action, the line of code for that action is highlighted in the source panel. The "Open in VSCode" button is at the top-right. Clicking it opens your test in VS Code at that line of code.

## Call Tab

The call tab shows information about the action:
- Time it took
- Locator used
- Strict mode status
- Key used

## Log Tab

See a full log of your test to understand what Playwright is doing behind the scenes:
- Scrolling into view
- Waiting for element to be visible, enabled, and stable
- Performing actions such as click, fill, press

## Errors Tab

If a test fails, see error messages in the Errors tab. The timeline shows a red line highlighting where the error occurred. Click the source tab to see which line of source code has the error.

## Console Tab

See console logs from the browser as well as from your test. Different icons show if the console log came from the browser or from the test file.

## Network Tab

The Network tab shows all network requests made during the test. Sort by:
- Request type
- Status code
- Method
- Request
- Content type
- Duration
- Size

Click a request to see request headers, response headers, request body, and response body.

## Attachments Tab

Explore attachments including visual regression testing screenshots. Compare screenshots by examining the image diff, actual image, and expected image. Click the expected image to use a slider to see differences.

## Metadata Tab

Shows test information:
- Browser
- Viewport size
- Test duration
- More details

## Watch Mode

Click the eye icon next to each test name to activate watch mode, which re-runs the test when you make changes. Watch multiple tests by clicking the eye icon next to each, or watch all tests by clicking the eye icon at the top of the sidebar.

## Docker and GitHub Codespaces

For Docker and GitHub Codespaces, run UI Mode in the browser by binding to the `0.0.0.0` interface:

```bash
npx playwright test --ui-host=0.0.0.0
```

For a static port:

```bash
npx playwright test --ui-port=8080 --ui-host=0.0.0.0
```

**Security Note:** When specifying `--ui-host=0.0.0.0`, UI Mode with traces, passwords, and secrets are accessible from other machines inside your network.

## Best Practices

- Use watch mode during development for instant feedback on changes
- Leverage the pick locator feature to find and test locators before using them
- Use the timeline view to understand test timing and identify slow actions
- Pop out DOM snapshots for detailed debugging with browser DevTools
- Filter by project to focus on specific browser configurations
