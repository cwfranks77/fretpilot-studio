import threading
import time
import random
from typing import Any, Dict


class AudioEngine:
    """Lightweight audio engine simulator inspired by Viper4Android architecture."""

    def __init__(self, settings: Dict[str, Any]) -> None:
        self.settings = settings
        self._running = False
        self._lock = threading.Lock()
        self._thread: threading.Thread | None = None
        self.last_headroom = 0.0
        self.last_meter = 0.0

    def start(self) -> None:
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._run_loop, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._running = False
        if self._thread:
            self._thread.join(timeout=2.0)
            self._thread = None

    def apply_settings(self, settings: Dict[str, Any]) -> None:
        with self._lock:
            self.settings = settings

    def status(self) -> Dict[str, Any]:
        with self._lock:
            copy = self.settings.copy()
        return {
            "gain_db": copy.get("gain_db"),
            "active_eq": len(copy.get("eq", [])),
            "compressor": copy.get("compressor"),
            "headroom": round(self.last_headroom, 2),
            "meter": round(self.last_meter, 2)
        }

    def _run_loop(self) -> None:
        meter_refresh = self.settings.get("monitor", {}).get("meter_refresh_s", 1.0)
        while self._running:
            with self._lock:
                gain = float(self.settings.get("gain_db", 0.0))
                ratio = float(self.settings.get("compressor", {}).get("ratio", 1.0))
            self.last_headroom = max(0.0, 20.0 - abs(gain) - ratio)
            self.last_meter = max(0.0, max(0.0, 80 + gain - ratio * 2) + random.uniform(-3, 3))
            time.sleep(meter_refresh)
