# ScanPCB Demo Board

Board ID: `SCAN-DEMO-001`  
Current revision: `1.0`  
Status: fictional proof-of-concept hardware

The Demo Board is a plausible USB-powered ESP32-S3 development and sensor interface board created to exercise the ScanPCB data model. It demonstrates board identity, hardware revisions, a smart-BOM foundation, firmware compatibility, test points, known issues, troubleshooting and QR linking.

## Functional concept

- USB-C input and USB 2.0 data;
- CP2102N USB-to-UART bridge;
- ESP32-S3-WROOM-1 module;
- AP2112K-3.3 LDO regulator;
- status LED and user button;
- exposed power, UART and I2C test points.

## Important limitation

This board has not been manufactured or electrically validated. The schematic, PCB and Gerber directories are placeholders that document the intended repository contract. Electrical values in diagnostic files are design targets for the fictional example, not measurements from physical hardware.

## Revision 1.0

The first revision demonstrates the complete documentation path:

```text
scanpcb.yaml
|-- hardware/REV1
|   |-- schematic
|   |-- bom
|   |-- pcb
|   `-- gerber
|-- firmware
|-- diagnostics
`-- images
```

See [CHANGELOG.md](CHANGELOG.md) for revision history and [scanpcb.yaml](scanpcb.yaml) for the authoritative metadata.

## Datasheets

Datasheets are linked from `scanpcb.yaml` and the BOM. They are not copied into this repository. Links point to official manufacturer sources.

## License note

Repository code and metadata follow the root project license. The fictional hardware design license is intentionally `TBD` because no released design files exist yet.

