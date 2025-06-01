# Dependency Updates

## Recent Updates

The following dependencies were updated to fix npm warnings and errors during CI builds:

### ESLint Updates
- Updated `eslint` from v8.57.1 to v9.28.0
- Added `@eslint/config-array` v0.20.0 to replace deprecated `@humanwhocodes/config-array`
- Added `@eslint/object-schema` v2.1.6 to replace deprecated `@humanwhocodes/object-schema`

### Other Dependency Fixes
- Added override for `domexception` to use `@xmldom/xmldom` instead
- Added override for `abab` to use `base64-js` instead

## Package Overrides

The following overrides were added to package.json to ensure transitive dependencies use non-deprecated versions:

```json
"overrides": {
  "glob": "^10.3.10",
  "rimraf": "^5.0.5",
  "inflight": "lru-cache@^10.2.0",
  "domexception": "npm:@xmldom/xmldom@^0.8.10",
  "abab": "npm:base64-js@^1.5.1",
  "@humanwhocodes/object-schema": "@eslint/object-schema@^2.1.6",
  "@humanwhocodes/config-array": "@eslint/config-array@^0.20.0",
  "eslint": "^9.28.0"
}
```

## Warnings Fixed

These updates resolve the following npm warnings that were appearing during CI builds:

```
npm warn deprecated domexception@4.0.0: Use your platform's native DOMException instead
npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
```