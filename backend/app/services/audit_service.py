import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any
from app.core.config import settings

AUDIT_FILE = Path(settings.STORAGE_PATH) / "audit.log"

def log_event(event: str, payload: Dict[str, Any]) -> None:
    try:
        AUDIT_FILE.parent.mkdir(parents=True, exist_ok=True)
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "event": event,
            "data": payload,
        }
        with AUDIT_FILE.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception:
        # Best-effort logging; don't crash if file not writable
        pass
