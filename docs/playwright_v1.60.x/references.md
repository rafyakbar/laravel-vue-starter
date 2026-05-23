# Playwright v1.60.x

> End-to-end testing framework for web applications with cross-browser support and powerful automation capabilities.

## Overview

Playwright is a Node.js library for browser automation that enables reliable end-to-end testing of web applications. It provides cross-browser testing across Chromium, Firefox, and WebKit with a single API. This documentation covers testing patterns, API references, and best practices for building robust test suites.

## Key Concepts

- **Browser Context** — Isolated browser session that provides clean state for each test
- **Locator** — Auto-waiting element selector that retries until element is ready
- **Fixture** — Reusable test setup and teardown logic injected into tests
- **Page Object Model** — Pattern for organizing test code around UI components
- **Trace Viewer** — Tool for debugging tests by recording browser actions and network activity
- **Auto-waiting** — Built-in mechanism that waits for elements to be actionable before interaction

## References

### Getting Started

- [001_getting-started.md](references/001_getting-started.md): Installation guide covering npm initialization, VS Code extension setup, browser downloads, running first tests, HTML reports, UI mode introduction, and system requirements for Windows, macOS, and Linux
- [002_writing-tests.md](references/002_writing-tests.md): Core test writing concepts including navigation, user interactions, web-first assertions, test isolation, test hooks (beforeEach, afterEach), and the difference between async and synchronous matchers
- [003_generating-tests.md](references/003_generating-tests.md): Codegen tool for recording browser interactions and generating test code automatically, including assertion recording, locator picking, and emulation for different devices
- [004_running-tests.md](references/004_running-tests.md): Running tests via CLI including filtering by file/name/project, headed vs headless mode, UI mode for debugging, Playwright Inspector, and HTML report viewing
- [005_trace-viewer-intro.md](references/005_trace-viewer-intro.md): Introduction to trace recording configuration, opening traces from HTML reports, and navigating the timeline to inspect DOM snapshots, network requests, and console logs
- [006_setting-up-ci.md](references/006_setting-up-ci.md): GitHub Actions workflow configuration, viewing test logs in CI, downloading and serving HTML reports, publishing reports to Azure Storage, and handling sensitive data in artifacts
- [007_vscode.md](references/007_vscode.md): VS Code extension features including running tests with play buttons, debugging with breakpoints, live locator highlighting, AI-powered fix suggestions, trace viewer integration, and codegen recording

### Releases and Versions

- [008_release-notes.md](references/008_release-notes.md): Version history and changelog documenting new features, breaking changes, browser version updates, and migration considerations between Playwright releases
- [009_canary-releases.md](references/009_canary-releases.md): Using canary releases for early access to upcoming features, installation commands, and considerations for testing pre-release versions in development environments
- [010_agents.md](references/010_agents.md): Test agents architecture for distributed test execution, agent configuration, and integration with cloud testing platforms

### Test Configuration

- [011_annotations.md](references/011_annotations.md): Test annotations for categorization including @skip, @only, @fixme, @slow tags, custom annotations for reporting, and attaching metadata like bugs or severity levels
- [012_command-line.md](references/012_command-line.md): Complete CLI reference for playwright test command including options for filtering, debugging, reporters, projects, retries, sharding, and configuration overrides
- [013_configuration.md](references/013_configuration.md): playwright.config.ts file structure including test directory, timeout settings, expect configuration, use options, projects for multi-browser testing, and web server setup
- [014_configuration-use.md](references/014_configuration-use.md): Test use options for setting base URL, storage state, viewport, screenshot settings, trace configuration, video recording, and locale/timezone overrides
- [015_emulation.md](references/015_emulation.md): Device emulation for mobile testing including viewport, user agent, device scale factor, touch support, geolocation, color scheme, and timezone configuration
- [016_fixtures.md](references/016_fixtures.md): Custom fixtures for reusable test setup including built-in fixtures (page, context, request), defining custom fixtures, fixture inheritance, and combining multiple fixtures
- [017_global-setup-teardown.md](references/017_global-setup-teardown.md): Project-wide setup and teardown for database seeding, server startup, authentication setup, and cleanup operations that run once before/after all tests
- [018_parallelism.md](references/018_parallelism.md): Parallel test execution strategies including worker processes, file-level parallelism, test-level parallelism, and controlling parallelism with test.describe.configure
- [019_parameterize-tests.md](references/019_parameterize-tests.md): Data-driven testing with test.each and describe.each for running the same test with different data sets, including dynamic test titles and complex data structures
- [020_projects.md](references/020_projects.md): Multi-project configuration for testing across browsers, devices, and environments including project dependencies for setup tests, running projects independently, and sharing configuration
- [021_reporters.md](references/021_reporters.md): Test reporter configuration including built-in reporters (list, line, dot, HTML, JSON, JUnit), custom reporters, reporter options, and configuring multiple reporters simultaneously
- [022_retries.md](references/022_retries.md): Retry configuration for flaky tests including global retry settings, per-test retries, retry-specific behavior, and understanding when retries are appropriate
- [023_sharding.md](references/023_sharding.md): Test sharding for distributing tests across multiple machines including CLI configuration, CI integration strategies, and combining with parallelism for optimal execution time
- [024_timeouts.md](references/024_timeouts.md): Timeout configuration hierarchy including test timeout, expect timeout, action timeout, navigation timeout, and best practices for setting appropriate timeout values
- [025_typescript.md](references/025_typescript.md): TypeScript configuration for Playwright including tsconfig setup, type definitions, using @ts-check in JS files, and common TypeScript patterns in tests
- [026_ui-mode.md](references/026_ui-mode.md): UI Mode features including watch mode, time travel debugging, locator picker, trace viewing, filtering tests, and the complete interactive development experience
- [027_web-server.md](references/027_web-server.md): Web server configuration for automatically starting development servers before tests, including port configuration, command setup, and handling server readiness

### Library and Core

- [028_library.md](references/028_library.md): Using Playwright as a library instead of test runner including browser launching, context creation, page manipulation, and integration with other testing frameworks

### Testing Guides

- [029_accessibility-testing.md](references/029_accessibility-testing.md): Accessibility testing integration with axe-core including configuration, running accessibility scans, asserting on violations, and testing WCAG compliance
- [030_actions.md](references/030_actions.md): User interaction methods including click, fill, press, check, select, hover, drag, upload files, and understanding auto-waiting behavior for each action
- [031_assertions.md](references/031_assertions.md): Web-first assertions reference including toBeVisible, toHaveText, toHaveValue, toHaveCount, toBeEnabled, page assertions, and custom retry logic with expect.poll
- [032_api-testing.md](references/032_api-testing.md): API testing with request context including making GET/POST/PUT/DELETE requests, handling responses, authentication, file uploads, and combining API and UI tests
- [033_authentication.md](references/033_authentication.md): Authentication strategies including saving and loading storage state, reusing authentication across tests, multi-user scenarios, and handling complex login flows
- [034_auto-waiting.md](references/034_auto-waiting.md): Actionability checks performed before actions including visibility, stability, enabled state, editability, and understanding when auto-waiting applies vs explicit waits
- [035_best-practices.md](references/035_best-practices.md): Testing best practices including locator strategies, test isolation principles, avoiding anti-patterns, handling flaky tests, and structuring test suites for maintainability
- [036_browsers.md](references/036_browsers.md): Browser management including supported browsers (Chromium, Firefox, WebKit), channel configuration (chrome, msedge), browser installation, and browser-specific features
- [037_chrome-extensions.md](references/037_chrome-extensions.md): Testing Chrome extensions including loading unpacked extensions, interacting with extension popups, background pages, and handling extension permissions
- [038_clock.md](references/038_clock.md): Time manipulation with page.clock including setting system time, pausing time, advancing time, simulating timers, and testing time-dependent functionality
- [039_components.md](references/039_components.md): Component testing for React, Vue, Svelte, and other frameworks including component mounting, props handling, and isolating component tests from full application
- [040_debugging-tests.md](references/040_debugging-tests.md): Debugging tools including Playwright Inspector, VS Code debugger integration, browser DevTools, console debugging, and trace-based debugging strategies
- [041_dialogs.md](references/041_dialogs.md): Handling browser dialogs including alert, confirm, prompt, and beforeunload with page.on('dialog') event handling and accepting/dismissing dialogs programmatically
- [042_downloads.md](references/042_downloads.md): File download handling including waiting for downloads, saving to specific paths, reading download content, and validating downloaded file properties
- [043_evaluating-javascript.md](references/043_evaluating-javascript.md): JavaScript execution in browser context including page.evaluate, page.evaluateHandle, argument passing, returning values, and locator.evaluate for element-scoped execution
- [044_events.md](references/044_events.md): Browser event handling including page events (request, response, console, dialog), event subscription patterns, and cleanup for avoiding memory leaks
- [045_extensibility.md](references/045_extensibility.md): Extending Playwright with custom selector engines, custom matchers, and integrating with other tools through the extension API
- [046_frames.md](references/046_frames.md): Working with iframes including locating frames by name/URL, frame locators, nested frames, and interacting with elements inside frame contexts
- [047_handles.md](references/047_handles.md): JSHandle and ElementHandle reference for direct object references including creation, property access, method invocation, and when to use handles vs locators
- [048_isolation.md](references/048_isolation.md): Browser context isolation explaining how contexts provide clean state, storage isolation, and independent cookie/cache between tests
- [049_locators.md](references/049_locators.md): Locator API reference including getByRole, getByText, getByLabel, getByPlaceholder, getByTestId, CSS/XPath selectors, locator filtering, chaining, and strictness
- [050_mock-apis.md](references/050_mock-apis.md): API mocking with page.route including intercepting requests, modifying responses, mocking network failures, and conditional routing based on request properties
- [051_mock-browser-apis.md](references/051_mock-browser-apis.md): Browser API mocking including geolocation, clipboard, permissions, and other browser APIs that can be overridden in tests
- [052_navigations.md](references/052_navigations.md): Page navigation handling including goto, reload, goBack, goForward, waitForURL, waitForLoadState, and handling multi-page navigation scenarios
- [053_network.md](references/053_network.md): Network interception and monitoring including page.on('request'), page.on('response'), request/response modification, authentication headers, and HAR file recording
- [054_other-locators.md](references/054_other-locators.md): Alternative locator strategies including CSS selectors, XPath expressions, legacy text locators, and when to use them over recommended locators
- [055_pages.md](references/055_pages.md): Page management including page creation, multiple pages, page events, closing pages, and working with popup windows and tabs
- [056_page-object-models.md](references/056_page-object-models.md): Page Object Model pattern implementation including class structure, encapsulating locators, reusable methods, inheritance, and integration with fixtures
- [057_screenshots.md](references/057_screenshots.md): Screenshot capture including full page screenshots, element screenshots, comparison screenshots, and configuring screenshot quality and type
- [058_service-workers.md](references/058_service-workers.md): Service worker testing including registration, interception, cache management, and testing offline scenarios
- [059_snapshot-testing.md](references/059_snapshot-testing.md): ARIA snapshot testing with YAML templates for asserting page structure, accessibility tree verification, and handling dynamic content
- [060_test-generator.md](references/060_test-generator.md): Codegen tool detailed usage including recording modes, assertion generation, locator customization, output language selection, and preserving authenticated state
- [061_touch-events.md](references/061_touch-events.md): Touch event simulation for mobile testing including tap, long press, pinch, zoom, and multi-touch gestures
- [062_trace-viewer.md](references/062_trace-viewer.md): Trace viewer detailed guide including trace configuration, timeline navigation, action inspection, network analysis, console logs, and exporting traces
- [063_videos.md](references/063_videos.md): Video recording configuration including enabling videos, output paths, video size, and viewing recorded test executions
- [064_visual-comparisons.md](references/064_visual-comparisons.md): Visual regression testing with screenshot comparisons including toHaveScreenshot matcher, baseline management, threshold configuration, and handling dynamic content
- [065_webview2.md](references/065_webview2.md): Testing Microsoft Edge WebView2 applications including configuration, embedding in applications, and WebView2-specific testing considerations

### Migration Guides

- [066_migrating-from-protractor.md](references/066_migrating-from-protractor.md): Migration guide from Protractor including API mapping, locator translation, control flow differences, and step-by-step migration strategy
- [067_migrating-from-puppeteer.md](references/067_migrating-from-puppeteer.md): Migration guide from Puppeteer including API differences, locator adoption, test runner benefits, and code transformation patterns
- [068_migrating-from-testing-library.md](references/068_migrating-from-testing-library.md): Migration guide from Testing Library including query mapping to Playwright locators, assertion differences, and leveraging auto-waiting

### Deployment

- [069_docker.md](references/069_docker.md): Docker configuration including official Playwright images, Dockerfile setup, running tests in containers, and handling browser dependencies
- [070_continuous-integration.md](references/070_continuous-integration.md): CI setup guides for GitHub Actions, Azure Pipelines, Jenkins, GitLab CI, CircleCI, and other platforms including caching strategies and parallel execution
- [071_selenium-grid.md](references/071_selenium-grid.md): Selenium Grid integration for connecting to existing grid infrastructure including connector configuration, browser allocation, and limitations
- [072_supported-languages.md](references/072_supported-languages.md): Language bindings overview including JavaScript/TypeScript, Python, Java, and .NET with installation, API differences, and cross-language concepts

## Links

- Website: https://playwright.dev
- GitHub: https://github.com/microsoft/playwright
- Documentation: https://playwright.dev/docs/intro
