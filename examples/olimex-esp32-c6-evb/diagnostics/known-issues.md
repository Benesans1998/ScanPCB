# Known issues and FAQ-derived troubleshooting

Source: [official Olimex ESP32-C6-EVB product FAQ](https://www.olimex.com/Products/IoT/ESP32-C6/ESP32-C6-EVB/open-source-hardware), checked 20 October 2026.

## FAQ-USB-BOOT: USB repeatedly connects and disconnects

When the board flash is empty, the USB connection can appear and disappear and some relay LEDs can blink. Olimex describes this as expected behavior.

To enter upload mode manually:

1. Hold `BUT1`.
2. Press and release `RST1`.
3. Release `BUT1`.
4. Upload valid firmware using a supported toolchain.

## FAQ-USB-CDC: no serial output

The ESP32-C6 uses its built-in USB connection. If firmware runs but no serial data appears, verify that USB CDC is enabled in the selected toolchain. In Arduino IDE the relevant setting is available from the Tools menu.

## Safety boundary

The board includes relays rated for mains-class loads. Perform firmware and USB troubleshooting with hazardous voltages disconnected unless a qualified procedure requires otherwise.

