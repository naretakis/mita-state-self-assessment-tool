# Design Document - Multi-Branch Deployment Infrastructure

## Overview

The Multi-Branch Deployment Infrastructure provides a sophisticated GitHub Actions-based deployment system that supports multiple isolated environments on GitHub Pages. The system implements intelligent content preservation, environment-specific configuration, and robust error handling to enable parallel development workflows with production, development, and testing environments.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│            Multi-Branch Deployment Infrastructure           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ GitHub Actions  │    │  Environment    │                │
│  │ Workflow        │    │  Configuration  │                │
│  │                 │    │                 │                │
│  │ - Trigger       │◄──►│ - Base Paths    │                │
│  │   Detection     │    │ - Asset Prefix  │                │
│  │ - Branch Logic  │    │ - Build Config  │                │
│  └─────────────────┘    └─────────────────┘                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Content         │    │  Build System   │                │
│  │ Preservation    │    │                 │                │
│  │                 │    │ - Next.js       │                │
│  │ - Artifact      │◄──►│   Export        │                │
│  │   Download      │    │ - Environment   │                │
│  │ - Live Site     │    │   Variables     │                │
│  │   Fallback      │    │ - Asset Opt     │                │
│  └─────────────────┘    └─────────────────┘                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Deployment      │    │ Error Handling  │                │
│  │ Orchestration   │    │ & Validation    │                │
│  │                 │    │                 │                │
│  │ - Site Assembly │◄──►│ - Deployment    │                │
│  │ - Path Routing  │    │   Validation    │                │
│  │ - Asset Upload  │    │ - Rollback      │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Flow

1. **Trigger Detection**: Identify branch and determine target environment
2. **Environment Configuration**: Set base paths and build configuration
3. **Content Preservation**: Download existing site content to preserve other environments
4. **Build Process**: Build application with environment-specific configuration
5. **Site Assembly**: Combine new build with preserved content
6. **Deployment**: Upload assembled site to GitHub Pages
7. **Validation**: Verify deployment success and site structure

## Components and Interfaces

### GitHub Actions Workflow

Main deployment workflow with environment-specific logic:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, dev, test]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'dev'
        type: choice
        options:
          - main
          - dev
          - test

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages-${{ github.ref }}"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
```

### Environment Configuration

Environment-specific build and deployment configuration:

```typescript
interface EnvironmentConfig {
  name: 'production' | 'development' | 'test';
  branch: 'main' | 'dev' | 'test';
  basePath: string;
  assetPrefix: string;
  buildCommand: string;
  deploymentPath: string;
  preserveOtherEnvironments: boolean;
}

const EnvironmentConfigs: Record<string, EnvironmentConfig> = {
  main: {
    name: 'production',
    branch: 'main',
    basePath: '/mita-state-self-assessment-tool',
    assetPrefix: '/mita-state-self-assessment-tool',
    buildCommand: 'npm run build',
    deploymentPath: '.',
    preserveOtherEnvironments: true
  },
  dev: {
    name: 'development',
    branch: 'dev',
    basePath: '/mita-state-self-assessment-tool/dev',
    assetPrefix: '/mita-state-self-assessment-tool/dev',
    buildCommand: 'npm run build',
    deploymentPath: 'dev',
    preserveOtherEnvironments: true
  },
  test: {
    name: 'test',
    branch: 'test',
    basePath: '/mita-state-self-assessment-tool/test',
    assetPrefix: '/mita-state-self-assessment-tool/test',
    buildCommand: 'npm run build',
    deploymentPath: 'test',
    preserveOtherEnvironments: true
  }
};
```

### Content Preservation System

Handles preservation of existing site content during deployments:

```bash
#!/bin/bash
# Content Preservation Script

preserve_existing_content() {
  local target_branch=$1
  local site_dir="site"
  
  echo "=== PRESERVING EXISTING CONTENT ==="
  mkdir -p "$site_dir"
  
  # Try to download from GitHub Actions artifacts first
  if download_from_artifacts "$site_dir"; then
    echo "Successfully downloaded from artifacts"
  else
    echo "Artifact download failed, falling back to live site"
    download_from_live_site "$site_dir" "$target_branch"
  fi
  
  # Ensure directory structure exists
  mkdir -p "$site_dir/dev" "$site_dir/test"
  touch "$site_dir/.nojekyll"
  
  echo "=== CONTENT PRESERVATION COMPLETE ==="
  log_site_structure "$site_dir"
}

download_from_artifacts() {
  local site_dir=$1
  
  if [ -f "existing-site/artifact.tar" ]; then
    cd "$site_dir"
    tar -xf "../existing-site/artifact.tar"
    cd ..
    return 0
  fi
  
  return 1
}

download_from_live_site() {
  local site_dir=$1
  local target_branch=$2
  local base_url="https://naretakis.github.io/mita-state-self-assessment-tool"
  
  # Download main site if not building main
  if [ "$target_branch" != "main" ]; then
    download_environment_content "$base_url" "$site_dir" "main"
  fi
  
  # Download dev site if not building dev
  if [ "$target_branch" != "dev" ]; then
    download_environment_content "$base_url/dev" "$site_dir/dev" "dev"
  fi
  
  # Download test site if not building test
  if [ "$target_branch" != "test" ]; then
    download_environment_content "$base_url/test" "$site_dir/test" "test"
  fi
}
```

### Build System Integration

Next.js configuration for multi-environment builds:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  
  // Environment-specific configuration
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // GitHub Pages compatibility
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Build optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Environment variables
  env: {
    DEPLOYMENT_ENVIRONMENT: process.env.DEPLOYMENT_ENVIRONMENT || 'development',
    BUILD_TIMESTAMP: new Date().toISOString(),
  },
};

module.exports = nextConfig;
```

### Deployment Orchestration

Handles the assembly and deployment of the complete site:

```bash
#!/bin/bash
# Deployment Orchestration Script

deploy_to_environment() {
  local branch=$1
  local build_output="out"
  local site_dir="site"
  
  echo "=== DEPLOYING TO ENVIRONMENT: $branch ==="
  
  # Set environment variables
  set_environment_variables "$branch"
  
  # Build the application
  echo "Building application for $branch..."
  npm run build
  
  if [ $? -ne 0 ]; then
    echo "Build failed for $branch"
    exit 1
  fi
  
  # Deploy to appropriate path
  case "$branch" in
    "main")
      deploy_to_root "$build_output" "$site_dir"
      ;;
    "dev")
      deploy_to_subdirectory "$build_output" "$site_dir/dev"
      ;;
    "test")
      deploy_to_subdirectory "$build_output" "$site_dir/test"
      ;;
    *)
      echo "Unsupported branch: $branch"
      exit 1
      ;;
  esac
  
  # Ensure proper routing files
  setup_routing_files "$site_dir" "$branch"
  
  echo "=== DEPLOYMENT COMPLETE ==="
}

set_environment_variables() {
  local branch=$1
  
  case "$branch" in
    "main")
      export NEXT_PUBLIC_BASE_PATH="/mita-state-self-assessment-tool"
      export DEPLOYMENT_ENVIRONMENT="production"
      ;;
    "dev")
      export NEXT_PUBLIC_BASE_PATH="/mita-state-self-assessment-tool/dev"
      export DEPLOYMENT_ENVIRONMENT="development"
      ;;
    "test")
      export NEXT_PUBLIC_BASE_PATH="/mita-state-self-assessment-tool/test"
      export DEPLOYMENT_ENVIRONMENT="test"
      ;;
  esac
}
```

## Data Models

### Deployment Configuration

```typescript
interface DeploymentConfig {
  workflow: {
    name: string;
    triggers: DeploymentTrigger[];
    permissions: WorkflowPermissions;
    concurrency: ConcurrencyConfig;
  };
  environments: Record<string, EnvironmentConfig>;
  contentPreservation: ContentPreservationConfig;
  validation: ValidationConfig;
}

interface DeploymentTrigger {
  type: 'push' | 'workflow_dispatch' | 'schedule';
  branches?: string[];
  inputs?: WorkflowInput[];
}

interface WorkflowPermissions {
  contents: 'read' | 'write';
  pages: 'write';
  idToken: 'write';
}

interface ConcurrencyConfig {
  group: string;
  cancelInProgress: boolean;
}
```

### Site Structure

```typescript
interface SiteStructure {
  root: {
    files: string[];
    directories: string[];
  };
  environments: {
    [key: string]: {
      path: string;
      files: string[];
      size: number;
      lastUpdated: string;
    };
  };
  metadata: {
    totalSize: number;
    lastDeployment: string;
    deploymentBranch: string;
  };
}

interface DeploymentResult {
  success: boolean;
  environment: string;
  branch: string;
  timestamp: string;
  buildTime: number;
  deploymentTime: number;
  siteStructure: SiteStructure;
  errors?: DeploymentError[];
  warnings?: string[];
}
```

### Error Handling

```typescript
interface DeploymentError {
  stage: 'build' | 'preservation' | 'assembly' | 'upload' | 'validation';
  type: 'fatal' | 'warning' | 'info';
  message: string;
  details?: string;
  recoverable: boolean;
  suggestedAction?: string;
}

interface ValidationResult {
  passed: boolean;
  checks: ValidationCheck[];
  overallScore: number;
  recommendations: string[];
}

interface ValidationCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}
```

## Deployment Strategies

### Blue-Green Deployment

```yaml
# Blue-Green deployment strategy for zero-downtime updates
strategy:
  blue-green:
    enabled: true
    validation:
      - health-check
      - smoke-tests
      - performance-baseline
    rollback:
      automatic: true
      conditions:
        - validation-failure
        - error-rate-threshold
```

### Canary Deployment

```yaml
# Canary deployment for gradual rollouts
strategy:
  canary:
    enabled: false  # Not applicable for static sites
    percentage: 10
    duration: "5m"
    success-criteria:
      - error-rate < 1%
      - response-time < 2s
```

## Monitoring and Observability

### Deployment Metrics

```typescript
interface DeploymentMetrics {
  buildMetrics: {
    duration: number;
    bundleSize: number;
    assetCount: number;
    compressionRatio: number;
  };
  deploymentMetrics: {
    duration: number;
    uploadSize: number;
    preservedContentSize: number;
    totalSiteSize: number;
  };
  performanceMetrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    timeToInteractive: number;
  };
}
```

### Health Checks

```bash
#!/bin/bash
# Post-deployment health checks

validate_deployment() {
  local environment=$1
  local base_url=$2
  
  echo "=== VALIDATING DEPLOYMENT: $environment ==="
  
  # Check if site is accessible
  if ! curl -f -s "$base_url" > /dev/null; then
    echo "ERROR: Site not accessible at $base_url"
    return 1
  fi
  
  # Check critical pages
  local critical_pages=("/" "/dashboard" "/about-tool")
  for page in "${critical_pages[@]}"; do
    if ! curl -f -s "$base_url$page" > /dev/null; then
      echo "WARNING: Critical page not accessible: $page"
    fi
  done
  
  # Check asset loading
  local assets_check=$(curl -s "$base_url" | grep -c "_next/static")
  if [ "$assets_check" -eq 0 ]; then
    echo "WARNING: No Next.js assets found"
  fi
  
  echo "=== VALIDATION COMPLETE ==="
  return 0
}
```

## Security Considerations

### Deployment Security

```yaml
security:
  permissions:
    minimum-required: true
    contents: read
    pages: write
    id-token: write
  
  secrets:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deployment-key: ${{ secrets.DEPLOYMENT_KEY }}
  
  validation:
    artifact-integrity: true
    content-security-policy: true
    dependency-scanning: true
```

### Content Security

```typescript
interface SecurityConfig {
  contentSecurityPolicy: {
    defaultSrc: string[];
    scriptSrc: string[];
    styleSrc: string[];
    imgSrc: string[];
  };
  
  integrityChecks: {
    artifacts: boolean;
    dependencies: boolean;
    buildOutput: boolean;
  };
  
  accessControl: {
    branchProtection: boolean;
    requiredReviews: number;
    dismissStaleReviews: boolean;
  };
}
```

## Testing Strategy

### Deployment Testing

1. **Unit Tests**:
   - Test environment configuration logic
   - Validate content preservation algorithms
   - Test deployment orchestration functions
   - Verify error handling and recovery

2. **Integration Tests**:
   - Test complete deployment workflows
   - Validate cross-environment isolation
   - Test artifact preservation and restoration
   - Verify routing and asset loading

3. **End-to-End Tests**:
   - Test deployments to actual GitHub Pages
   - Validate site functionality across environments
   - Test rollback and recovery procedures
   - Verify performance and accessibility

### Performance Testing

```yaml
performance-tests:
  build-time:
    target: < 5 minutes
    warning: > 3 minutes
    
  deployment-time:
    target: < 2 minutes
    warning: > 1 minute
    
  site-size:
    target: < 50MB
    warning: > 30MB
    
  asset-optimization:
    compression: > 70%
    minification: enabled
```

## Disaster Recovery

### Backup and Recovery

```bash
#!/bin/bash
# Backup and recovery procedures

create_deployment_backup() {
  local environment=$1
  local backup_dir="backups/$(date +%Y%m%d_%H%M%S)_$environment"
  
  mkdir -p "$backup_dir"
  
  # Backup current site structure
  wget -r -np -nH -P "$backup_dir" \
    "https://naretakis.github.io/mita-state-self-assessment-tool/"
  
  # Create metadata
  echo "{
    \"environment\": \"$environment\",
    \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
    \"branch\": \"$GITHUB_REF_NAME\",
    \"commit\": \"$GITHUB_SHA\"
  }" > "$backup_dir/metadata.json"
  
  echo "Backup created: $backup_dir"
}

restore_from_backup() {
  local backup_path=$1
  local target_environment=$2
  
  echo "Restoring from backup: $backup_path"
  
  # Validate backup integrity
  if [ ! -f "$backup_path/metadata.json" ]; then
    echo "ERROR: Invalid backup - missing metadata"
    return 1
  fi
  
  # Restore site content
  cp -r "$backup_path"/* site/
  
  echo "Restore complete"
}
```

### Rollback Procedures

```yaml
rollback:
  automatic:
    triggers:
      - deployment-failure
      - validation-failure
      - critical-error-rate
    
  manual:
    commands:
      - gh workflow run deploy.yml --ref previous-stable
      - gh api repos/:owner/:repo/pages/builds --method POST
    
  validation:
    post-rollback:
      - health-checks
      - smoke-tests
      - user-acceptance
```