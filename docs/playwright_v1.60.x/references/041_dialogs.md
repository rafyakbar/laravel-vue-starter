# Dialogs

> Source: https://playwright.dev/docs/dialogs

## Background

Playwright can interact with web page dialogs such as `alert`, `confirm`, `prompt`, and `beforeunload` confirmation.

## alert(), confirm(), prompt() Dialogs

By default, dialogs are auto-dismissed. Register a dialog handler before the action that triggers the dialog:

```typescript
page.on('dialog', dialog => dialog.accept());
await page.getByRole('button').click();
```

**Important:** The `page.on('dialog')` listener must handle the dialog. Otherwise, actions will stall because dialogs are modal and block execution.

### Wrong Pattern

```typescript
// This will hang - dialog is logged but not handled
page.on('dialog', dialog => console.log(dialog.message()));
await page.getByRole('button').click(); // Stalls here
```

**Note:** If there is no listener for `page.on('dialog')`, all dialogs are automatically dismissed.

## Dialog Methods

| Method | Description |
|--------|-------------|
| `dialog.accept()` | Accepts the dialog |
| `dialog.dismiss()` | Dismisses the dialog |
| `dialog.message()` | Returns dialog message |
| `dialog.defaultValue()` | Returns default prompt value |
| `dialog.type()` | Returns dialog type |

## Accepting with Input

For `prompt` dialogs, pass input value:

```typescript
page.on('dialog', dialog => dialog.accept('my input'));
await page.getByRole('button').click();
```

## Dismissing Dialogs

```typescript
page.on('dialog', dialog => dialog.dismiss());
await page.getByRole('button').click();
```

## beforeunload Dialog

Handle `beforeunload` dialogs when closing a page:

```typescript
page.on('dialog', async dialog => {
  assert(dialog.type() === 'beforeunload');
  await dialog.dismiss();
});
await page.close({ runBeforeUnload: true });
```

## Print Dialogs

Assert that a print dialog was triggered:

```typescript
await page.goto('<url>');
await page.evaluate('(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()');
await page.getByText('Print it!').click();
await page.waitForFunction('window.waitForPrintDialog');
```

## Best Practices

- Register dialog handlers before triggering actions
- Always handle dialogs in the handler (accept or dismiss)
- Use `page.once('dialog', ...)` for one-time handling
- For `prompt` dialogs, provide the expected input value
- Handle `beforeunload` when testing page close behavior
