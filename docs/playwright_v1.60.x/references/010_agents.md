# Playwright Test Agents

> Source: https://playwright.dev/docs/test-agents

## Background

Playwright comes with three Test Agents out of the box: 🎭 planner, 🎭 generator, and 🎭 healer. These agents can be used independently, sequentially, or as chained calls in an agentic loop to produce test coverage for your product.

## Getting Started

Start by adding Playwright Test Agent definitions to your project using the `init-agents` command:

```bash
# VS Code
npx playwright init-agents --loop=vscode

# Claude Code
npx playwright init-agents --loop=claude

# OpenCode
npx playwright init-agents --loop=opencode
```

These definitions should be regenerated whenever Playwright is updated to pick up new tools and instructions.

## 🎭 Planner

Planner agent explores your app and produces a test plan for one or many scenarios and user flows.

### Inputs

- A clear request to the planner (e.g., "Generate a plan for guest checkout")
- A `seed test` that sets up the environment necessary to interact with your app
- (optional) A Product Requirement Document (PRD) for context

### Example Seed Test

```typescript
import { test, expect } from './fixtures';

test('seed', async ({ page }) => {
  // this test uses custom fixtures from ./fixtures
});
```

### Output

- A Markdown test plan saved as `specs/basic-operations.md`
- The plan is human-readable but precise enough for test generation

## 🎭 Generator

Generator agent uses the Markdown plan to produce executable Playwright Tests. It verifies selectors and assertions live as it performs the scenarios.

### Inputs

- Markdown plan from `specs/`

### Output

- A test suite under `tests/`
- Generated tests may include initial errors that can be healed automatically by the healer agent

## 🎭 Healer

When a test fails, the healer agent:

- Replays the failing steps
- Inspects the current UI to locate equivalent elements or flows
- Suggests a patch (e.g., locator update, wait adjustment, data fix)
- Re-runs the test until it passes or until guardrails stop the loop

### Inputs

- Failing test name

### Output

- A passing test, or a skipped test if the healer believes that functionality is broken

## Project Structure

```
repo/
  .github/                    # agent definitions
  specs/                      # human-readable test plans
    basic-operations.md
  tests/                      # generated Playwright tests
    seed.spec.ts              # seed test for environment
    tests/create/add-valid-todo.spec.ts
  playwright.config.ts
```

## Best Practices

- Use seed tests to bootstrap environment setup
- Include relevant context files when prompting agents
- Review generated tests before committing
- Run the healer agent when tests fail to automatically repair issues
