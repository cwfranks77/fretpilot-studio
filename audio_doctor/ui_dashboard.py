import threading
import time
from typing import Any, Dict


class UIDashboard:
    """Text-based dashboard and control surface for the Audio Doctor engine."""

    def __init__(self, engine: Any, config_manager: Any) -> None:
        self.engine = engine
        self.config_manager = config_manager
        self._running = False
        self._thread: threading.Thread | None = None

    def run(self) -> None:
        self._running = True
        try:
            self._thread = threading.Thread(target=self._input_loop, daemon=True)
            self._thread.start()
            while self._running:
                self._render()
                time.sleep(1.0)
        except KeyboardInterrupt:
            self.shutdown()

    def _render(self) -> None:
        status = self.engine.status()
        print("\nAudio Doctor Status")
        print("----------------------------")
        print(f"Gain: {status['gain_db']} dB")
        compressor = status.get("compressor") or {}
        print(f"Compressor: threshold={compressor.get('threshold_db')} dB, ratio={compressor.get('ratio')}x")
        print(f"Headroom: {status['headroom']}")
        print(f"Meter: {status['meter']}")
        print("Commands: status | set gain <db> | set compressor <threshold_db|ratio> <value> | save | quit")

    def _input_loop(self) -> None:
        while self._running:
            try:
                command = input("audio-doctor> ").strip()
            except EOFError:
                self.shutdown()
                break
            if not command:
                continue
            parts = command.split()
            if parts[0] == "status":
                self._render()
            elif parts[0] == "set" and len(parts) >= 3:
                target = parts[1]
                if target == "gain" and len(parts) == 3:
                    try:
                        value = float(parts[2])
                        self._update_gain(value)
                    except ValueError:
                        print("Invalid gain value")
                elif target == "compressor" and len(parts) == 4:
                    field = parts[2]
                    try:
                        val = float(parts[3])
                        self._update_compressor(field, val)
                    except ValueError:
                        print("Invalid value")
                else:
                    print("Usage: set gain <db> | set compressor <threshold_db|ratio> <value>")
            elif parts[0] == "save":
                self.config_manager.save()
                print("Configuration saved")
            elif parts[0] == "quit":
                self.shutdown()
            else:
                print("Unknown command")

    def _update_gain(self, gain_value: float) -> None:
        config = self.config_manager.data
        config["gain_db"] = gain_value
        self.engine.apply_settings(config)
        print(f"Gain set to {gain_value} dB")

    def _update_compressor(self, field: str, value: float) -> None:
        config = self.config_manager.data
        compressor = config.setdefault("compressor", {})
        allowed = {"threshold": "threshold_db", "threshold_db": "threshold_db", "ratio": "ratio"}
        key = allowed.get(field)
        if key is None:
            print("Compressor field must be threshold_db or ratio")
            return
        compressor[key] = value
        self.config_manager.update({"compressor": compressor})
        self.engine.apply_settings(config)
        print(f"Compressor {field} updated to {value}")

    def shutdown(self) -> None:
        if not self._running:
            return
        print("Shutting down Audio Doctor dashboard...")
        self._running = False
        self.engine.stop()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=1.0)
