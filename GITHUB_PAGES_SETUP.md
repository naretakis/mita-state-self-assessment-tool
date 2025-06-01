# GitHub Pages Multi-Branch Deployment Setup

This document explains how to set up and use the multi-branch GitHub Pages deployment for the MITA State Self-Assessment Tool.

## Overview

The deployment system allows for:
- Main branch deployment at the root URL
- Feature branch deployments at branch-specific URLs
- Automatic cleanup of stale deployments

## GitHub Repository Settings

To enable GitHub Pages deployment:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. Under **Build and deployment**, ensure GitHub Actions is selected

## URL Structure

- **Main branch**: `https://[username].github.io/mita-state-self-assessment-tool/`
- **Feature branches**: `https://[username].github.io/mita-state-self-assessment-tool/[branch-name]/`

Note: Branch names with slashes (e.g., `feature/new-ui`) will be converted to use hyphens in the URL (e.g., `feature-new-ui`).

## Workflow Files

The deployment is managed by two GitHub Actions workflow files:

1. `.github/workflows/deploy.yml` - Handles building and deploying branches
2. `.github/workflows/cleanup.yml` - Cleans up deployments when branches are deleted

## How It Works

### Deployment Process

1. When code is pushed to `main` or any branch starting with `feature/` or `release/`, the deployment workflow runs
2. The workflow:
   - Detects the branch name
   - Sets the appropriate base path
   - Builds the Next.js application
   - Deploys to GitHub Pages with the correct path configuration

### Cleanup Process

The cleanup workflow runs when:
- A pull request is closed
- The workflow is manually triggered with a branch name

Note: Due to GitHub Pages limitations, the cleanup workflow currently logs the intent but doesn't actually remove deployments. For a complete solution, consider using a custom deployment approach.

## Testing Your Deployment

After pushing to a branch:

1. Go to the **Actions** tab in your GitHub repository
2. Find the most recent "Deploy to GitHub Pages" workflow run
3. Wait for it to complete
4. Click on the deployment URL in the summary

## Troubleshooting

If your deployment isn't working:

1. Check the GitHub Actions logs for errors
2. Verify that GitHub Pages is enabled in repository settings
3. Ensure the `NEXT_PUBLIC_BASE_PATH` environment variable is being set correctly
4. Check that the `.nojekyll` file exists in the repository root

## Local Development

When developing locally, the base path is automatically set to an empty string, so all links work correctly in the development environment.