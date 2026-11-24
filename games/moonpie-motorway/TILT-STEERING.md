# Mobile tilt steering

Enable tilt from the garage or pause menu, approve motion access if prompted, and hold the phone in a comfortable grip. The first valid reading establishes neutral. Recenter is available in both places; rotating the display also recenters. Tilt remains opt-in for each page visit. Touch steering, brake, and boost remain available, and manual steering takes priority.

The screen-relative gravity projection supports portrait and both landscape directions. A three-degree dead zone filters small hand movements; an additional 22 degrees reaches full steering. The existing simulation applies its normal steering smoothing. Only the final steering input is recorded for leaderboard verification; sensor readings are not uploaded.

Sensor data older than 750 ms produces zero steering, and the next reading reestablishes neutral. Backgrounding or losing focus clears the previous reading. Denied permission, unsupported browsers, and an initial five-second sensor timeout retain button controls.

Validation includes simulated orientation readings, permission approval/denial, both landscape directions, recentering, stale data, backgrounding, and manual input priority. Headless Chromium mobile layout checks passed. Real iPhone/Safari and Android hardware testing remains necessary to tune steering feel and confirm each browser's permission flow.
