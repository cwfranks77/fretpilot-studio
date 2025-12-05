"""Audio Doctor engine launcher."""
from pathlib import Path

from audio_doctor.audio_engine import AudioEngine
from audio_doctor.config_manager import ConfigManager
from audio_doctor.ui_dashboard import UIDashboard


def main() -> None:
    config_path = Path(__file__).resolve().with_name("audio-doctor-config.json")
    config = ConfigManager(str(config_path))
    settings = config.load()

    engine = AudioEngine(settings)
    engine.start()

    ui = UIDashboard(engine, config)
    ui.run()


if __name__ == "__main__":
    main()
