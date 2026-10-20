# Troubleshooting

## Board does not power on

This flow is an illustrative diagnostic tree for REV 1.0. Use a current-limited source and suitable instruments. Stop if the board shows heat, smoke, damaged insulation or a suspected short.

```text
Power disconnected: visual inspection
              |
              v
        Safe to energize?
          /          \
        NO            YES
        |               |
      STOP          Measure TP1
                        |
                 5.0 V +/- 5%?
                   /         \
                 NO           YES
                 |             |
          Input path fault   Measure TP2
                                 |
                          3.3 V +/- 3%?
                            /          \
                          NO            YES
                          |              |
                 Regulator path      Check TP3 EN
                                           |
                                      Logic high?
                                       /       \
                                     NO         YES
                                     |           |
                               Reset path    Read TP4 UART
```

The machine-readable version with stable node IDs is in `troubleshooting.yaml`.

