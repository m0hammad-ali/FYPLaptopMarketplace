# Contributing Guide

## Branch Strategy

| Branch          | Purpose                                 |
| --------------- | --------------------------------------- |
| main            | production-ready and deployable branch  |
| feat/<name>     | new feature work                        |
| fix/<name>      | bug fixes                               |
| docs/<name>     | documentation-only changes              |
| refactor/<name> | structural or internal code refactoring |

## Commit Convention

This project follows Conventional Commits.

### Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

| Type     | Use case                                       |
| -------- | ---------------------------------------------- |
| feat     | new feature                                    |
| fix      | bug fix                                        |
| docs     | documentation-only update                      |
| style    | formatting and minor presentation changes      |
| refactor | internal restructuring without behavior change |
| test     | test additions or fixes                        |
| chore    | tooling or maintenance work                    |
| perf     | performance improvements                       |
| ci       | CI/CD pipeline changes                         |
| revert   | revert a previous commit                       |

### Recommended Scopes

Use the affected module name where possible, such as:

- catalog
- auth
- inventory
- ai
- customer
- vendor
- admin
- home
- gateway
- db
- ui
- ci
- docs
- docker
- config

### Examples

Good examples:

```text
feat(catalog): add laptop CRUD with ACID transactions
fix(ai): handle NaN values in cosine similarity
docs(readme): update setup instructions
refactor(auth): extract JWT verification to middleware
test(integration): add register/login flow tests
ci: add GitHub Actions build job
```

Avoid vague messages such as:

```text
update stuff
fixed bug
changes
asdf
```

### Commit Rules

- keep the subject line under 72 characters
- use imperative mood, such as "add" not "added"
- do not end the subject with a period
- include a short body when needed to explain why the change was required
- reference issues using "Closes #12" when applicable

## Pull Request Checklist

- [ ] branch is up to date with main
- [ ] commits follow the conventional format
- [ ] local tests pass
- [ ] no linter warnings remain
- [ ] docs are updated if behavior changed
- [ ] screenshots are attached for UI changes

## Before Committing

Run the following locally:

```bash
pnpm install
docker-compose build
./scripts/test-integration.sh
```

## Secrets

Never commit the following:

- .env files unless an example file is intentionally shared
- API keys, passwords, tokens, and secrets
- database dumps containing real data

If a secret is accidentally committed, rotate it immediately.
