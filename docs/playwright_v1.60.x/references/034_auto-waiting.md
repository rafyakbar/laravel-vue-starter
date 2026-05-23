# Auto-Waiting

> Source: https://playwright.dev/docs/actionability

## Background

Playwright performs actionability checks on elements before making actions to ensure they behave as expected. It auto-waits for all relevant checks to pass before performing the requested action. If checks don't pass within the timeout, the action fails with `TimeoutError`.

## Actionability Checks

For `locator.click()`, Playwright ensures:
- Locator resolves to exactly one element
- Element is Visible
- Element is Stable (not animating)
- Element Receives Events (not obscured)
- Element is Enabled

## Checks Per Action

| Action | Attached | Visible | Stable | Receives Events | Enabled | Editable |
|--------|----------|---------|--------|-----------------|---------|----------|
| `locator.check()` | Yes | Yes | Yes | Yes | - | - |
| `locator.click()` | Yes | Yes | Yes | Yes | - | - |
| `locator.dblclick()` | Yes | Yes | Yes | Yes | - | - |
| `locator.setChecked()` | Yes | Yes | Yes | Yes | - | - |
| `locator.tap()` | Yes | Yes | Yes | Yes | - | - |
| `locator.uncheck()` | Yes | Yes | Yes | Yes | - | - |
| `locator.hover()` | Yes | Yes | Yes | - | - | - |
| `locator.dragTo()` | Yes | Yes | Yes | - | - | - |
| `locator.screenshot()` | Yes | Yes | - | - | - | - |
| `locator.fill()` | Yes | - | - | Yes | Yes | - |
| `locator.clear()` | Yes | - | - | Yes | Yes | - |
| `locator.selectOption()` | Yes | - | - | Yes | - | - |
| `locator.selectText()` | Yes | - | - | - | - | - |
| `locator.scrollIntoViewIfNeeded()` | - | Yes | - | - | - | - |
| `locator.blur()` | - | - | - | - | - | - |
| `locator.dispatchEvent()` | - | - | - | - | - | - |
| `locator.focus()` | - | - | - | - | - | - |
| `locator.press()` | - | - | - | - | - | - |
| `locator.pressSequentially()` | - | - | - | - | - | - |
| `locator.setInputFiles()` | - | - | - | - | - | - |

## Forcing Actions

Some actions support `force` option to disable non-essential actionability checks:

```typescript
await page.getByRole('button').click({ force: true });
```

This skips checks like verifying the target element receives click events.

## Auto-Retrying Assertions

Playwright includes auto-retrying assertions that wait until conditions are met:

| Assertion | Description |
|-----------|-------------|
| `expect(locator).toBeAttached()` | Element is attached |
| `expect(locator).toBeChecked()` | Checkbox is checked |
| `expect(locator).toBeDisabled()` | Element is disabled |
| `expect(locator).toBeEditable()` | Element is editable |
| `expect(locator).toBeEmpty()` | Container is empty |
| `expect(locator).toBeEnabled()` | Element is enabled |
| `expect(locator).toBeFocused()` | Element is focused |
| `expect(locator).toBeHidden()` | Element is not visible |
| `expect(locator).toBeInViewport()` | Element intersects viewport |
| `expect(locator).toBeVisible()` | Element is visible |
| `expect(locator).toContainText()` | Element contains text |
| `expect(locator).toHaveAttribute()` | Element has DOM attribute |
| `expect(locator).toHaveClass()` | Element has class property |
| `expect(locator).toHaveCount()` | List has exact number of children |
| `expect(locator).toHaveCSS()` | Element has CSS property |
| `expect(locator).toHaveId()` | Element has ID |
| `expect(locator).toHaveJSProperty()` | Element has JavaScript property |
| `expect(locator).toHaveText()` | Element matches text |
| `expect(locator).toHaveValue()` | Input has a value |
| `expect(locator).toHaveValues()` | Select has options selected |
| `expect(page).toHaveTitle()` | Page has a title |
| `expect(page).toHaveURL()` | Page has a URL |
| `expect(response).toBeOK()` | Response has OK status |

## Visibility Definitions

Element is considered visible when:
- It has non-empty bounding box
- Does not have `visibility:hidden` computed style

Notes:
- Elements of zero size are not considered visible
- Elements with `display:none` are not considered visible
- Elements with `opacity:0` are considered visible

## Stability Definition

Element is considered stable when it has maintained the same bounding box for at least two consecutive animation frames.

## Enabled Definition

Element is considered enabled when it is not disabled.

Element is disabled when:
- It is a `<button>`, `<select>`, `<input>`, `<textarea>`, `<option>`, or `<optgroup>` with a `[disabled]` attribute
- It is inside a `<fieldset>` with a `[disabled]` attribute
- It is a descendant of an element with `[aria-disabled=true]`

## Editable Definition

Element is considered editable when enabled and not readonly.

Element is readonly when:
- It is a `<select>`, `<input>`, or `<textarea>` with a `[readonly]` attribute
- It has `[aria-readonly=true]` attribute and a supporting aria role

## Receives Events Definition

Element is considered receiving pointer events when it is the hit target of the pointer event at the action point.

For example, when clicking at `(10;10)`, Playwright checks whether another element (usually an overlay) will capture the click at that point.

## Best Practices

- Let Playwright auto-wait instead of adding manual waits
- Use auto-retrying assertions to avoid flaky tests
- Use `force` option only when you understand the implications
- Understand visibility rules when debugging test failures
- Use `dispatchEvent()` when you need to bypass all actionability checks
