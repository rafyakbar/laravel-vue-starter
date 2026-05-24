## MODIFIED Requirements

### Requirement: E2E tests are runnable via npm scripts
The system SHALL provide npm scripts for common Playwright operations, and the project count in documentation SHALL reflect the actual number of tests including responsive viewport tests.

#### Scenario: Run all E2E tests headlessly
- **WHEN** `npm run test:e2e` is executed
- **THEN** Playwright runs all tests across all viewport projects (mobile, tablet, desktop) and reports results

#### Scenario: Run E2E tests in UI mode
- **WHEN** `npm run test:e2e:ui` is executed
- **THEN** Playwright opens the interactive UI mode showing all viewport projects

#### Scenario: Run E2E tests in headed mode
- **WHEN** `npm run test:e2e:headed` is executed
- **THEN** Playwright runs all viewport project tests with a visible browser window

#### Scenario: README test count is accurate
- **WHEN** the README.md is checked
- **THEN** the Playwright E2E test count reflects the actual number of tests in the suite (including responsive tests)