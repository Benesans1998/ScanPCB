# Roadmap

The roadmap separates the Linux Day proof of concept from platform ideas that require real product discovery and security work.

## v0.1: proof of concept

- [x] repository structure based on open files;
- [x] ScanPCB YAML specification and schema;
- [x] real-world Olimex ESP32-C6-EVB example with official upstream links;
- [x] separate fictional Demo Board fixture with revision metadata;
- [x] structured BOM, test points, known issues and troubleshooting;
- [x] reproducible SVG QR generation;
- [x] responsive static home and board page;
- [x] architecture and contribution documentation;
- [ ] review the vocabulary with electronic designers and repair technicians;
- [ ] test a printed QR at realistic PCB silkscreen sizes;
- [ ] replace repository and public-site placeholders after publication.

## v0.2: field feedback

- collect real board examples under clear licenses;
- define compatibility and deprecation rules for schema changes;
- add fixture-based validation tests;
- document QR durability, redirects and revision-selection policy;
- test KiCad export conventions without building a plugin yet;
- define provenance for lifecycle and alternative-part claims.

## Future platform directions

- accounts and designer profiles;
- manufacturer profiles and board registration;
- managed QR generation and redirect service;
- global board search;
- advanced revision management;
- BOM parsing and normalization;
- component lifecycle monitoring;
- qualified alternative components;
- interactive diagnostics and decision trees;
- review and collaboration workflows;
- public API;
- KiCad integration;
- GitHub and GitLab integration;
- self-hosted ScanPCB instances;
- complete board export;
- signed offline documentation packages.

## Non-goals until validated

- AI image recognition of unknown PCBs;
- payment or enterprise billing systems;
- complex notification infrastructure;
- replacing Git or EDA tools;
- storing the only copy of a designer's files.

