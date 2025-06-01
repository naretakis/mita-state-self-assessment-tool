# GitHub Pages Deployment Guide

This document explains how to deploy the MITA State Self-Assessment Tool to GitHub Pages with multi-branch deployment support.

## Overview

The application is configured to deploy:
- Main branch to the root URL: `https://[username].github.io/mita-state-self-assessment-tool/`
- Feature branches to branch-specific URLs: `https://[username].github.io/mita-state-self-assessment-tool/branch/[branch-name]/`

## GitHub Repository Settings

To enable GitHub Pages deployment:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Pages**
3. Configure the following settings:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` / `(root)`
   - Click **Save**

## GitHub Actions Workflows

Two GitHub Actions workflows are configured:

1. **Main Branch Deployment** (`deploy-main.yml`)
   - Triggered on pushes to the `main` branch
   - Deploys to the root of GitHub Pages site

2. **Feature Branch Deployment** (`deploy-feature.yml`)
   - Triggered on pushes to any branch except `main`
   - Deploys to a branch-specific subfolder

## Manual Deployment

You can also manually trigger deployments:

1. Go to the **Actions** tab in your GitHub repository
2. Select either the "Deploy Main Branch" or "Deploy Feature Branch" workflow
3. Click **Run workflow** and select the branch you want to deploy

## Testing Deployments

After deployment, your sites will be available at:

- Main branch: `https://[username].github.io/mita-state-self-assessment-tool/`
- Feature branches: `https://[username].github.io/mita-state-self-assessment-tool/branch/[branch-name]/`

## Troubleshooting

If you encounter issues with the deployment:

1. Check the GitHub Actions logs for any build or deployment errors
2. Verify that the GitHub Pages settings are correctly configured
3. Ensure your repository has the necessary permissions set for GitHub Actions

## Base Path Configuration

The application uses environment variables to handle different deployment paths:

- `NEXT_PUBLIC_BASE_PATH` is set during build time to ensure all assets load correctly
- For the main branch, it's set to `/mita-state-self-assessment-tool`
- For feature branches, it's set to `/mita-state-self-assessment-tool/branch/[branch-name]`

This configuration ensures that all assets and links work correctly regardless of the deployment path.