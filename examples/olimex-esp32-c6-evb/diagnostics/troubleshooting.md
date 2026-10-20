# Troubleshooting: USB programming and serial output

```text
USB connect/disconnect loop and relay LEDs blink?
                  |
           +------+------+
           |             |
          YES            NO
           |             |
  Flash may be empty   Check USB CDC
           |             |
  Hold BUT1             Enabled?
  Press/release RST1    /      \
  Release BUT1        NO        YES
           |           |         |
       Upload       Enable CDC  Use official
       firmware                 examples
```

Source: official Olimex product FAQ. This local rendering is a concise ScanPCB index, not a replacement for upstream instructions.

