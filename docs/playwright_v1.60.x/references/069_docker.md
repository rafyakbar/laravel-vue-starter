# Docker

> Source: https://playwright.dev/docs/docker

## Background

Playwright provides official Docker images for running tests in containerized environments. The images include Playwright browsers and system dependencies, making CI setup straightforward.

## Official Image

Pull the Playwright Docker image:

```bash
docker pull mcr.microsoft.com/playwright:v1.60.0-noble
```

## Usage

### End-to-End Tests

For trusted test code, run as root:

```bash
docker run -it --rm --ipc=host mcr.microsoft.com/playwright:v1.60.0-noble /bin/bash
```

### Crawling and Scraping

For untrusted websites, use a separate user with seccomp profile:

```bash
docker run -it --rm --ipc=host --user pwuser \
  --security-opt seccomp=seccomp_profile.json \
  mcr.microsoft.com/playwright:v1.60.0-noble /bin/bash
```

## Recommended Configuration

When running Playwright in Docker:

1. Use `--init` flag to handle processes with PID=1
2. Use `--ipc=host` for Chromium to avoid memory issues
3. Use `--cap-add=SYS_ADMIN` if encountering Chromium launch errors

## Remote Connection

### Running Playwright Server

Start the server in Docker:

```bash
docker run -p 3000:3000 --rm --init -it \
  --workdir /home/pwuser --user pwuser \
  mcr.microsoft.com/playwright:v1.60.0-noble \
  /bin/sh -c "npx -y playwright@1.60.0 run-server --port 3000 --host 0.0.0.0"
```

### Connecting to Server

Use environment variable with `@playwright/test`:

```bash
PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:3000/ npx playwright test
```

Or connect programmatically:

```typescript
const browser = await playwright['chromium'].connect('ws://127.0.0.1:3000/');
```

## Network Configuration

Access local servers from within Docker:

```bash
docker run --add-host=hostmachine:host-gateway -p 3000:3000 ...
```

Use `hostmachine` instead of `localhost` in tests.

## Image Tags

Available tags:
- `:v1.60.0` - Ubuntu 24.04 LTS (Noble Numbat)
- `:v1.60.0-noble` - Ubuntu 24.04 LTS (Noble Numbat)
- `:v1.60.0-jammy` - Ubuntu 22.04 LTS (Jammy Jellyfish)

## Base Images

Images are based on:
- Ubuntu 24.04 LTS (Noble Numbat)
- Ubuntu 22.04 LTS (Jammy Jellyfish)

Note: Alpine Linux is not supported (requires glibc).

## Build Custom Image

Create your own Dockerfile:

```dockerfile
FROM node:20-bookworm
RUN npx -y playwright@1.60.0 install --with-deps
```

## GitHub Codespaces Integration

Enable noVNC viewer in devcontainer:

```json
{
  "image": "mcr.microsoft.com/playwright:v1.60.0-noble",
  "forwardPorts": [6080],
  "features": {
    "desktop-lite": {
      "webPort": "6080"
    }
  }
}
```

## Best Practices

- Pin to specific version for reproducibility
- Match Playwright version in container with tests
- Use `--ipc=host` for Chromium stability
- Consider security implications when running as root
- Clean up containers and images regularly
- Use CI caching for faster builds
