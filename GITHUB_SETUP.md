# GitHub Integration & CI/CD Setup

This project is configured with a GitHub Actions workflow for Continuous Integration and Continuous Deployment (CI/CD).

## 1. Create a Repository on GitHub

1.  Log in to your GitHub account.
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name your repository (e.g., `maersk-app`).
4.  Do **not** check "Initialize with README", ".gitignore", or "License" (we already have these).
5.  Click **Create repository**.

## 2. Push Your Code

Run the following commands in your terminal (replace `<your-username>` with your actual GitHub username):

```bash
# Add the remote repository
git remote add origin https://github.com/<your-username>/maersk-app.git

# Rename main branch to 'main' if it isn't already
git branch -M main

# Push the code
git push -u origin main
```

## 3. Configure GitHub Secrets

For the CI/CD pipeline to deploy successfully (or to run tests that might eventually need real credentials), you need to configure secrets in GitHub.

1.  Go to your repository on GitHub.
2.  Click **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  Add the following secrets:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your production PostgreSQL connection string (e.g., from Neon, Railway, or your VPS). |
| `SESSION_SECRET` | A long, random string for session encryption. |
| `STAGING_HOST` | (Optional) Hostname/IP of your staging server (if using SSH deployment). |
| `STAGING_KEY` | (Optional) Private SSH key (if using SSH deployment). |

## 4. Understanding the Workflow

The workflow file is located at `.github/workflows/ci-cd.yml`.

### Triggers
- **Push to `main`**: Runs the full build, test, and deploy pipeline.
- **Pull Request**: Runs build and test only (prevents broken code from merging).

### Jobs
1.  **build-and-test**:
    - Installs Node.js dependencies (`npm ci`).
    - Runs the test suite (`npm test`).
    - Builds the application (`npm run build`).
2.  **deploy-staging**:
    - Runs *only* if `build-and-test` passes.
    - Currently configured as a simulation. You must edit the `run` step in `.github/workflows/ci-cd.yml` to match your actual hosting provider's deployment command (e.g., Vercel CLI, SSH command, etc.).

## 5. Branching Strategy

Follow these best practices:

- **`main`**: The production-ready code. Do not push directly to `main` for big features.
- **Feature Branches**: Create a new branch for every new feature or bugfix.
    ```bash
    git checkout -b feature/my-new-feature
    ```
- **Pull Requests**: When your feature is ready:
    1.  Push your branch: `git push origin feature/my-new-feature`.
    2.  Open a Pull Request (PR) on GitHub.
    3.  Wait for the CI checks (Build & Test) to pass.
    4.  Merge the PR into `main`.

## 6. Commit Messages

Use "Conventional Commits" style for clarity:
- `feat: add new login screen`
- `fix: resolve payment timeout bug`
- `docs: update deployment guide`
- `chore: update dependencies`
