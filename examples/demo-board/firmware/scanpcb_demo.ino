// ScanPCB Demo Board firmware example
// Target: ESP32-S3 Arduino core
// Status: illustrative, not validated on physical ScanPCB hardware

constexpr int STATUS_LED_PIN = 2;
constexpr unsigned long HEARTBEAT_MS = 1000;

void setup() {
  pinMode(STATUS_LED_PIN, OUTPUT);
  Serial.begin(115200);
  Serial.println("SCAN-DEMO-001 REV 1.0 boot");
}

void loop() {
  static bool ledState = false;
  ledState = !ledState;
  digitalWrite(STATUS_LED_PIN, ledState ? HIGH : LOW);
  Serial.println("heartbeat");
  delay(HEARTBEAT_MS);
}

