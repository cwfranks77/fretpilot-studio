import json
from pathlib import Path
from typing import Any, Dict

DEFAULT_CONFIG: Dict[str, Any] = {
    "gain_db": 0.0,
    "eq": [
        {"band": 1, "frequency": 60, "gain_db": 0.0, "q": 1.0},
        {"band": 2, "frequency": 250, "gain_db": 0.0, "q": 1.0},
        {"band": 3, "frequency": 1000, "gain_db": 0.0, "q": 1.0},
        {"band": 4, "frequency": 4000, "gain_db": 0.0, "q": 1.0},
        {"band": 5, "frequency": 12000, "gain_db": 0.0, "q": 1.0}
    ],
    "compressor": {
        "threshold_db": -18.0,
        "ratio": 3.0,
        "attack_ms": 10,
        "release_ms": 150
    },
    "monitor": {
        "meter_refresh_s": 1.0,
        "show_debug": True
    }
}


class ConfigManager:
    """Simple configuration manager for the Audio Doctor engine."""

    def __init__(self, path: str):
        self.path = Path(path)
        self.data: Dict[str, Any] = {}

    def load(self) -> Dict[str, Any]:
        if self.path.exists():
            try:
                raw = json.loads(self.path.read_text())
            except json.JSONDecodeError as error:  # pragma: no cover
                raise RuntimeError(f"Unable to parse config: {error}")
            self.data = self._merge(DEFAULT_CONFIG, raw)
        else:
            self.data = DEFAULT_CONFIG.copy()
            self.save()
        return self.data

    def save(self) -> None:
        self.path.write_text(json.dumps(self.data, indent=2))

    def update(self, updates: Dict[str, Any]) -> None:
        self.data = self._merge(self.data, updates)
        self.save()

    def _merge(self, base: Dict[str, Any], override: Dict[str, Any]) -> Dict[str, Any]:
        merged = base.copy()
        for key, value in override.items():
            if isinstance(value, dict) and isinstance(merged.get(key), dict):
                merged[key] = self._merge(merged[key], value)
            else:
                merged[key] = value
        return merged
