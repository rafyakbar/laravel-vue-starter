# Actions

> Source: https://playwright.dev/docs/input

## Background

Playwright can interact with HTML Input elements such as text inputs, checkboxes, radio buttons, select options, mouse clicks, type characters, keys and shortcuts as well as upload files and focus elements.

## Text Input

Use `locator.fill()` to fill out form fields. It focuses the element and triggers an `input` event. Works for `<input>`, `<textarea>` and `[contenteditable]` elements.

```typescript
// Text input
await page.getByRole('textbox').fill('Peter');

// Date input
await page.getByLabel('Birth date').fill('2020-02-02');

// Time input
await page.getByLabel('Appointment time').fill('13:15');

// Local datetime input
await page.getByLabel('Local time').fill('2020-03-02T05:15');
```

## Checkboxes and Radio Buttons

Use `locator.setChecked()` for checkboxes and radio buttons:

```typescript
// Check the checkbox
await page.getByLabel('I agree to the terms above').check();

// Assert the checked state
expect(page.getByLabel('Subscribe to newsletter')).toBeChecked();

// Select the radio button
await page.getByLabel('XL').check();
```

## Select Options

Use `locator.selectOption()` for `<select>` elements:

```typescript
// Single selection matching value or label
await page.getByLabel('Choose a color').selectOption('blue');

// Single selection matching label
await page.getByLabel('Choose a color').selectOption({ label: 'Blue' });

// Multiple selected items
await page.getByLabel('Choose multiple colors').selectOption(['red', 'green', 'blue']);
```

## Mouse Click

```typescript
// Generic click
await page.getByRole('button').click();

// Double click
await page.getByText('Item').dblclick();

// Right click
await page.getByText('Item').click({ button: 'right' });

// Shift + click
await page.getByText('Item').click({ modifiers: ['Shift'] });

// Ctrl + click on Windows/Linux, Meta + click on macOS
await page.getByText('Item').click({ modifiers: ['ControlOrMeta'] });

// Hover over element
await page.getByText('Item').hover();

// Click the top left corner
await page.getByText('Item').click({ position: { x: 0, y: 0 } });
```

### Actionability Checks

Before clicking, Playwright:
- Waits for element to be in DOM
- Waits for it to become displayed
- Waits for it to stop moving
- Scrolls the element into view
- Waits for it to receive pointer events
- Retries if the element is detached

### Forcing the Click

Bypass actionability checks when needed:

```typescript
await page.getByRole('button').click({ force: true });
```

### Programmatic Click

Dispatch a click event without actionability checks:

```typescript
await page.getByRole('button').dispatchEvent('click');
```

## Type Characters

Use `locator.pressSequentially()` to type character by character:

```typescript
// Press keys one by one
await page.locator('#area').pressSequentially('Hello World!');

// With delay between keystrokes
await page.locator('#area').pressSequentially('Hello World!', { delay: 100 });
```

**Note:** Use `locator.fill()` for most text input. Only use `pressSequentially()` when there's special keyboard handling.

## Keys and Shortcuts

```typescript
// Hit Enter
await page.getByText('Submit').press('Enter');

// Dispatch Control+Right
await page.getByRole('textbox').press('Control+ArrowRight');

// Press $ sign
await page.getByRole('textbox').press('$');
```

Supported key names: `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`, `Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, `F1-F12`, `Digit0-Digit9`, `KeyA-KeyZ`.

Modifiers: `Shift`, `Control`, `Alt`, `Meta`.

## Upload Files

```typescript
// Select one file
await page.getByLabel('Upload file').setInputFiles(path.join(__dirname, 'myfile.pdf'));

// Select multiple files
await page.getByLabel('Upload files').setInputFiles([
  path.join(__dirname, 'file1.txt'),
  path.join(__dirname, 'file2.txt'),
]);

// Select a directory
await page.getByLabel('Upload directory').setInputFiles(path.join(__dirname, 'mydir'));

// Remove all selected files
await page.getByLabel('Upload file').setInputFiles([]);

// Upload buffer from memory
await page.getByLabel('Upload file').setInputFiles({
  name: 'file.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('this is test')
});
```

Handle dynamic file inputs:

```typescript
const fileChooserPromise = page.waitForEvent('filechooser');
await page.getByLabel('Upload file').click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles(path.join(__dirname, 'myfile.pdf'));
```

## Focus Element

```typescript
await page.getByLabel('Password').focus();
```

## Drag and Drop

```typescript
await page.locator('#item-to-be-dragged').dragTo(page.locator('#item-to-drop-at'));
```

### Manual Dragging

For precise control:

```typescript
await page.locator('#item-to-be-dragged').hover();
await page.mouse.down();
await page.locator('#item-to-drop-at').hover();
await page.mouse.up();
```

**Note:** If your page relies on `dragover` events, hover the drop element twice before `mouse.up()`.

## Scrolling

Playwright automatically scrolls before most actions. For manual scrolling:

```typescript
// Scroll element into view
await page.getByText('Footer text').scrollIntoViewIfNeeded();

// Position mouse and scroll with wheel
await page.getByTestId('scrolling-container').hover();
await page.mouse.wheel(0, 10);

// Programmatically scroll
await page.getByTestId('scrolling-container').evaluate(e => e.scrollTop += 100);
```

## Best Practices

- Use `fill()` for text input instead of `pressSequentially()` unless special keyboard handling is needed
- Avoid `force: true` unless you understand the implications
- Let Playwright auto-scroll instead of manual scrolling
- Use locators that are resilient to DOM changes
- Wait for file chooser event when handling dynamic file uploads
