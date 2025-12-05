# Audio Doctor

Audio Doctor is the legacy-grade DSP-inspired audio experience you asked for—built to be better than Viper4Android by staying fully in userland while still offering rich controls, live status, and persistence.

## Components

- `main.py` – Entry point that loads settings, starts the audio engine, and launches the dashboard.
- `audio_doctor/config_manager.py` – Loads and merges `audio-doctor-config.json`, exposes update/save helpers.
- `audio_doctor/audio_engine.py` – Simulates gain/EQ/compressor processing and exposes runtime meters.
- `audio_doctor/ui_dashboard.py` – Simple CLI that renders meters, accepts gain/compressor tweaks, saves settings, and shuts down cleanly.

## Getting started

1. **Install Python 3.10+** (3.11 recommended).
2. **Run the app:**

   ```bash
   python main.py
   ```
3. From the `audio-doctor>` prompt, enter commands (e.g., `set gain 4`, `set compressor threshold_db -12`, `save`, `quit`). The dashboard prints headroom/meter updates every second.
4. Settings persist to `audio-doctor-config.json`. You can edit that file manually between runs if you need bulk modifications.

## Extending the Engine

- Replace the simulated loop in `AudioEngine._run_loop` with a real audio callback (using `pyaudio`, `sounddevice`, etc.) when you're ready to process live audio.
- The dashboard can be ported to a web UI by swapping `UIDashboard` with a Flask/FastAPI interface that exposes the same `engine.apply_settings` API.

This setup keeps everything writable without requiring root, just like Viper but with modern instrumentation and configurable JSON defaults.
