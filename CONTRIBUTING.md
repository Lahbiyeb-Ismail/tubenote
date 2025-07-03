# Contributing to TubeNote

First off, thank you for considering contributing to TubeNote! We're excited to have you on board. This document provides a set of guidelines to help you contribute effectively and efficiently.

## Table of Contents

1.  [Getting Started](#getting-started)
2.  [Branching Strategy](#branching-strategy)
3.  [Commit Message Conventions](#commit-message-conventions)
4.  [Pull Request Process](#pull-request-process)
5.  [Code Style & Quality](#code-style--quality)
6.  [Testing](#testing)
7.  [Documentation](#documentation)

## Getting Started

Before you begin, please ensure you have the following installed:
*   Node.js (LTS version)
*   pnpm

**Project Setup:**

1.  Fork the repository.
2.  Clone your forked repository: `git clone https://github.com/your-username/tubenote.git`
3.  Navigate to the project directory: `cd tubenote`
4.  Install dependencies: `pnpm install`
5.  Run the development server: `pnpm dev`

## Branching Strategy

We follow a Gitflow-inspired branching model. It's simple and effective for collaboration.

*   **`main`**: This branch contains production-ready code. Direct pushes are strictly forbidden.
*   **`develop`**: This is the primary development branch where all feature branches are merged. It should always be stable.
*   **Feature/Fix Branches**: All new work must be done on a separate branch.

**Branch Naming Convention:**

Use the following prefixes for your branches, followed by a short, descriptive name.

*   `feature/<description>`: For new features (e.g., `feature/user-profile-page`).
*   `fix/<description>`: For bug fixes (e.g., `fix/login-button-bug`).
*   `refactor/<description>`: For code refactoring (e.g., `refactor/simplify-auth-service`).
*   `chore/<description>`: For build tasks, package updates, etc. (e.g., `chore/update-dependencies`).
*   `docs/<description>`: For documentation changes (e.g., `docs/add-api-spec`).

**Workflow Example:**

1.  `git checkout develop`
2.  `git pull origin develop`
3.  `git checkout -b feature/new-cool-feature`
4.  ...do your work and commit your changes...
5.  `git push origin feature/new-cool-feature`
6.  Open a Pull Request to merge into `develop`.

## Commit Message Conventions

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps in automating changelogs and makes the project history easier to read.

**Format:**

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**`<type>`:** Must be one of the following:
*   **feat**: A new feature.
*   **fix**: A bug fix.
*   **refactor**: Code change that neither fixes a bug nor adds a feature.
*   **chore**: Changes to the build process or auxiliary tools.
*   **docs**: Documentation only changes.
*   **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc).
*   **test**: Adding missing tests or correcting existing ones.
*   **perf**: A code change that improves performance.
*   **ci**: Changes to our CI configuration files and scripts.
*   **build**: Changes that affect the build system or external dependencies.

**`<scope>`:** The package or app affected by the change (e.g., `client`, `server`, `database`, `dtos`, `youtube-api`).

**`<subject>`:** A concise description of the change.
*   Use the imperative, present tense: "add" not "added" nor "adds".
*   Don't capitalize the first letter.
*   No dot (.) at the end.

---

**Good Commit Message Examples:**

*   `feat(client): add user settings page`
*   `fix(server): correct password hashing algorithm`
*   `refactor(database): optimize query for fetching notes`
*   `chore(deps): update zod to version 3.22.4`
*   `docs(api): clarify rate limiting in README.md`

**Bad Commit Message Examples:**

*   `fix login` (No scope, vague subject)
*   `Added a new feature for the client app` (Not imperative, too long)
*   `refactor: code cleanup` (Vague subject)
*   `fix(server): Fixed a bug where the user session was not being cleared properly after logout, ensuring better security.` (Subject is too long and contains a period)

---

## Pull Request Process

1.  **Create a PR:** Open a pull request from your feature branch to the `develop` branch.
2.  **Use the Template:** Fill out the PR template with a clear description of your changes.
3.  **Title:** The PR title should follow the [Commit Message Conventions](#commit-message-conventions).
4.  **Review:** At least one other developer must review and approve the PR. Address any feedback or requested changes.
5.  **CI Checks:** All automated checks (linting, testing, building) must pass.
6.  **Merge:** Once approved and all checks pass, the author can merge the PR.

**Pull Request Description Template:**

```md
## Description

Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context.

## Related Issue

Closes #<issue-number>

## Type of Change

Please delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce.

- [ ] Unit Tests
- [ ] Integration Tests
- [ ] End-to-End Tests

## Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## Code Style & Quality

We use ESLint for linting and Prettier for formatting. Before committing, please run:

```bash
# Run linting and formatting checks
pnpm lint
```

Ensure all issues are resolved before pushing your code.

## Testing

We use Jest for testing. All new features must be accompanied by unit or integration tests. Bug fixes should include a regression test to prevent the issue from recurring.

To run all tests:

```bash
pnpm test
```

## Documentation

*   Comment your code where the logic is complex or non-obvious.
*   If you introduce a new feature that requires explanation, update the relevant `README.md` file.
*   If you add or change environment variables, update the `.env.example` file and document the changes.
