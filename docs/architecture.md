# Architecture

## v0.1 architecture

The proof of concept treats the Git repository as the system of record.

```text
scanpcb.yaml + open documentation files
                  |
                  +--> schema validation
                  |
                  +--> generated web data
                  |
                  +--> static board page
                  |
                  `--> SVG QR -> stable board URL
```

There is no database, authentication service or cloud dependency in v0.1. A small build script validates the board manifest, copies the relevant structured data into a generated JSON file and creates the QR artwork. The browser only renders static assets.

## Data ownership

The board author owns the repository. ScanPCB tooling reads standard files but does not require proprietary storage. A complete export is therefore the repository itself, including history when Git metadata is retained.

Generated files are disposable views. The editable source remains YAML, Markdown, CSV and native design files.

## Future hosted architecture

```text
User or QR scanner
        |
        v
ScanPCB web and API
        |
        +--> board registry metadata
        |
        +--> Git provider or self-hosted repository
        |
        +--> search and lifecycle workers
        |
        `--> optional access-control service
```

A future registry should store indexes, user accounts and access policy, not become the only copy of board documentation. Repository import and full export are architectural requirements.

## Boundaries

### Implemented in v0.1

- file-based board identity;
- multiple-revision data model;
- machine-readable validation;
- local QR generation;
- static home and board pages;
- a real-world Olimex ESP32-C6-EVB index that links official upstream artifacts;
- a separate fictional fixture for local component and diagnostic examples;
- Git-native collaboration guidance.

### Explicitly deferred

- identity, authentication and authorization;
- enforcement of `private` and `qr_only` visibility;
- global registry and search;
- database and public API;
- automated lifecycle monitoring;
- BOM ingestion and normalization;
- interactive diagnostic execution;
- GitHub, GitLab and KiCad integrations.

## Security and trust notes

- A visibility label cannot protect a file committed to a public repository.
- External datasheet links can change; future indexes should record the manufacturer, retrieval time and content hash where licensing permits.
- Community diagnostic advice requires review. The schema can carry provenance but does not certify safety.
- Board URLs require a durable domain and redirect policy before physical QR codes are manufactured.

