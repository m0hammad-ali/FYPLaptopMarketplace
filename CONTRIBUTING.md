# Contributing Guide

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| main | Production-ready, always deployable |
| feat/<name> | New feature (e.g., feat/multi-mode-ui) |
| fix/<name> | Bug fix (e.g., fix/nan-similarity) |
| docs/<name> | Documentation only |
| refactor/<name> | Code restructuring |

## Commit Convention

We follow Conventional Commits (https://www.conventionalcommits.org).

### Format

    <type>(<scope>): <subject>

    <body>

    <footer>

### Types

| Type | When to use |
|------|-------------|
| feat | A new feature |
| fix | A bug fix |
| docs | Documentation only |
| style | Formatting, missing semicolons, etc. |
| refactor | Code change that neither fixes a bug nor adds a feature |
| test | Adding or fixing tests |
| chore | Build process or tooling |
| perf | Performance improvement |
| ci | CI/CD configuration |
| revert | Reverting a previous commit |

### Scopes

Use the affected module: catalog, auth, inventory, ai, customer, vendor,
admin, home, gateway, db, ui, ci, docs, docker, config.

### Examples

Good:
    feat(catalog): add laptop CRUD with ACID transactions
    fix(ai): handle NaN values in cosine similarity
    docs(readme): update setup instructions
    refactor(auth): extract JWT verification to middleware
    test(integration): add register/login flow tests
    ci: add GitHub Actions build job

Bad:
    update stuff
    fixed bug
    changes
    asdf

### Rules

- Subject line: max 72 characters, imperative mood ("add" not "added")
- No period at end of subject
- Body: wrap at 72 chars, explain WHAT and WHY, not HOW
- Reference issues: Closes #12

## Pull Request Checklist

- [ ] Branch is up to date with main
- [ ] All commits follow convention
- [ ] Tests pass locally
- [ ] No linter warnings
- [ ] Docs updated if behavior changed
- [ ] Screenshots attached for UI changes

## Before Committing

Run these locally:

    pnpm install
    docker-compose build
    ./scripts/test-integration.sh

## Secrets

NEVER commit:
- .env files (except .env.example)
- API keys, passwords, tokens
- Database dumps with real data

If you accidentally commit a secret, rotate it immediately.
