# Downloads

> Source: https://playwright.dev/docs/downloads

## Background

For every attachment downloaded by the page, `page.on('download')` event is emitted. Downloads are saved to a temporary folder and deleted when the browser context closes.

## Basic Download Handling

```typescript
// Start waiting for download before clicking
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download file').click();
const download = await downloadPromise;

// Wait for download to complete and save
await download.saveAs('/path/to/save/' + download.suggestedFilename());
```

## Download Object Methods

| Method | Description |
|--------|-------------|
| `download.path()` | Path to downloaded file (temp location) |
| `download.saveAs(path)` | Save download to specified path |
| `download.suggestedFilename()` | Suggested filename from server |
| `download.url()` | URL of the download |
| `download.createReadStream()` | Readable stream of download |
| `download.failure()` | Download failure reason if any |
| `download.page()` | Page that initiated download |

## Handling Unknown Downloads

If you don't know what initiates the download:

```typescript
page.on('download', download => download.path().then(console.log));
```

**Warning:** Handling events this way forks control flow. Your test might end while downloading.

## Wait for Download Completion

```typescript
const download = await page.waitForEvent('download');
// Wait for the download process to complete
const path = await download.path();
```

## Save to Specific Location

```typescript
const download = await page.waitForEvent('download');
await download.saveAs('./downloads/' + download.suggestedFilename());
```

## Specify Download Directory

Configure where downloads are saved:

```typescript
const browser = await chromium.launch({
  downloadsPath: './downloads'
});
```

## Multiple Downloads

```typescript
const [download1, download2] = await Promise.all([
  page.waitForEvent('download'),
  page.waitForEvent('download'),
  page.getByText('Download all').click()
]);
```

## Best Practices

- Start waiting for download before triggering the action
- Use `saveAs()` to persist downloads beyond the test
- Use `suggestedFilename()` to get the original filename
- Remember that temporary downloads are deleted when context closes
- For uploads, see the uploading files section
