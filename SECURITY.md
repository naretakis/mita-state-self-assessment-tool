# Security Policy

## Overview

The MITA 4.0 State Self-Assessment Tool is designed with security and privacy as core principles. All assessment data is stored locally in the user's browser using IndexedDB—no data is transmitted to or stored on remote servers.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Security Features

### Data Privacy

- **Local-only storage**: All data remains in the browser's IndexedDB
- **No remote transmission**: No assessment data is sent to any server
- **No tracking**: No analytics or tracking scripts
- **User control**: Users can clear all data at any time

### Browser Security

- **Content Security Policy**: Strict CSP headers when deployed
- **HTTPS only**: Production deployment requires HTTPS
- **No external dependencies at runtime**: All assets bundled locally

## Security Best Practices for Users

### Browser Security

- Keep your browser updated to the latest version
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Be cautious of browser extensions that may access page data

### Data Protection

- Regularly export your assessment data as backups
- Clear browser data when using shared computers
- Use your organization's approved browsers and devices

### Network Security

- Access the tool over HTTPS only
- Be cautious on public Wi-Fi networks
- Follow your organization's security policies

## Known Limitations

### IndexedDB Storage

- Data is stored unencrypted in IndexedDB
- Browser data can be accessed by other scripts on the same origin
- Data may be cleared by browser cleanup tools

### File Attachments

- Uploaded files are stored as Blobs in IndexedDB
- Large attachments may impact browser performance
- File type validation is client-side only

## Security Updates

Security updates will be released as patch versions and announced through:

- GitHub Security Advisories
- CHANGELOG.md updates
- Release notes

## Compliance

This tool is designed to support:

- **WCAG 2.1 AA**: Accessibility compliance
- **Privacy by Design**: No data collection or transmission

For specific compliance requirements (HIPAA, FedRAMP, etc.), please consult with your organization's compliance team regarding the appropriateness of client-side-only tools for your use case.
