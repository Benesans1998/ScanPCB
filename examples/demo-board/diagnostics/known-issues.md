# Known issues

## KI-001: Random reset during Wi-Fi transmit burst

Status: illustrative and unverified  
Severity: medium  
Affected revision: REV 1.0

### Problem

The board may restart when the ESP32-S3 begins a high-current Wi-Fi transmit burst.

### Possible cause

The local bulk capacitance, regulator transient response or power-distribution impedance may be insufficient. The Demo Board has not been built, so this is a plausible teaching example rather than an observed failure.

### Test

Observe `TP2 VCC_3V3` with a short-ground oscilloscope probe while firmware forces repeated Wi-Fi transmissions.

### Expected result

The rail should remain inside the validated 3.3 V power budget. The initial documentation target is 3.3 V within 3 percent and no excessive transient droop.

### Action

Review regulator current and thermal margin, capacitor DC-bias derating, placement and power-plane impedance. Do not treat a larger capacitor as a validated fix without repeating transient and stability checks.

