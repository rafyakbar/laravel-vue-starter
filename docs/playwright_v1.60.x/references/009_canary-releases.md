# Canary Releases

> Source: https://playwright.dev/docs/canary-releases

## Background

Playwright for Node.js has a canary releases system that allows testing new unreleased features without waiting for a full release. Canary releases are published daily on the `next` NPM tag.

## Using Canary Releases

Install the canary version using the `@next` npm dist tag:

```bash
npm install -D @playwright/test@next
```

## NPM Dist Tags

The npm package has several dist tags:

- `latest`: stable releases
- `next`: next releases, published daily
- `beta`: after a release-branch is cut, usually a week before a stable release

## Safety Considerations

Using a canary release in production might seem risky, but in practice, it's not. A canary release:

- Passes all automated tests
- Is used internally to test the HTML report, Trace Viewer, and Playwright Inspector
- Allows maintainers to get feedback on newly implemented features

## Documentation

The stable and `next` documentation is published on playwright.dev. To see the `next` documentation, press Shift on the keyboard 5 times.

## Best Practices

- Use canary releases for testing new features in development
- Keep production projects on stable releases
- Report issues found in canary releases to help improve the stable release
- Check the `next` documentation for features not yet in stable
