---
name: solid-bashlib
description: Read, write, upload, and download files and directories from Solid pods using Bashlib. Manage file operations (cp, mv, rm, ls, find), access control (permissions), and authentication. Use when working with Solid pod storage, backing up pod data, sharing documents, or automating pod workflows - even if user just mentions "Solid pod" or "pod operations".
license: MIT
compatibility: opencode
metadata:
  workflow: solid-pod-management
  audience: developers
  domain: solid-decentralized-web
---

## Installation

```bash
npx solid-bashlib --help
```

## Authentication

```bash
# Set WebID
npx solid-bashlib auth set

# Create token for automation (CSS/ESS)
npx solid-bashlib auth create-token-css
```

## Basic Operations

### List and View

```bash
npx solid-bashlib ls base:/
npx solid-bashlib ls -la base:/documents/
npx solid-bashlib tree base:/
npx solid-bashlib curl base:/documents/file.txt
```

### Upload and Download

```bash
# Download from pod
npx solid-bashlib cp base:/documents/report.pdf ~/report.pdf

# Upload to pod
npx solid-bashlib cp ~/file.txt base:/documents/file.txt

# Upload directory
npx solid-bashlib cp ~/my-folder/ base:/backups/
```

### Create and Delete

```bash
npx solid-bashlib mkdir base:/new-folder/
npx solid-bashlib touch base:/file.txt
npx solid-bashlib rm base:/file.txt
npx solid-bashlib rm -r base:/folder/
```

### Move and Copy

```bash
npx solid-bashlib cp base:/src/file.txt base:/dst/file.txt
npx solid-bashlib mv base:/old-path/ base:/new-path/
```

## Permissions

```bash
# List permissions
npx solid-bashlib access list base:/file.txt

# Make publicly readable
npx solid-bashlib access set base:/file.txt p=r

# Grant WebID read access
npx solid-bashlib access set base:/file.txt https://friend.pod/profile/card#me=r

# Remove access
npx solid-bashlib access set base:/file.txt https://friend.pod/profile/card#me=
```

**Permission codes:** `r` (read), `w` (write), `a` (append), `c` (control)

## Search

```bash
npx solid-bashlib find base:/ "filename.txt"
npx solid-bashlib find base:/ "*.pdf"
```

## Debugging

```bash
# Check auth status
npx solid-bashlib auth show --pretty

# Test connection
npx solid-bashlib curl base:/

# Public access (no auth)
npx solid-bashlib --auth none curl http://public-pod.example.com/file.ttl
```

## More Information

Full documentation: https://solidlabresearch.github.io/Bashlib/
