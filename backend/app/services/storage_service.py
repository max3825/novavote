"""
Storage service with adapter pattern.
MVP uses local filesystem, production switches to IPFS.
"""
import os
import json
import hashlib
from typing import Dict, Any
from app.core.config import settings


class StorageAdapter:
    def store(self, data: Dict[str, Any]) -> str:
        raise NotImplementedError

    def retrieve(self, content_hash: str) -> Dict[str, Any]:
        raise NotImplementedError


class LocalStorageAdapter(StorageAdapter):
    def __init__(self, storage_path: str):
        self.storage_path = storage_path
        os.makedirs(storage_path, exist_ok=True)

    def store(self, data: Dict[str, Any]) -> str:
        content = json.dumps(data, sort_keys=True)
        content_hash = hashlib.sha256(content.encode()).hexdigest()
        file_path = os.path.join(self.storage_path, f"{content_hash}.json")
        
        with open(file_path, "w") as f:
            f.write(content)
        
        return content_hash

    def retrieve(self, content_hash: str) -> Dict[str, Any]:
        file_path = os.path.join(self.storage_path, f"{content_hash}.json")
        
        if not os.path.exists(file_path):
            return None
        
        with open(file_path, "r") as f:
            return json.load(f)


class IPFSStorageAdapter(StorageAdapter):
    """Placeholder for future IPFS integration."""
    def store(self, data: Dict[str, Any]) -> str:
        # TODO: ipfshttpclient.add_json(data)
        raise NotImplementedError("IPFS not implemented yet")

    def retrieve(self, content_hash: str) -> Dict[str, Any]:
        # TODO: ipfshttpclient.get_json(content_hash)
        raise NotImplementedError("IPFS not implemented yet")


def get_storage_adapter() -> StorageAdapter:
    if settings.STORAGE_MODE == "ipfs":
        return IPFSStorageAdapter()
    return LocalStorageAdapter(settings.STORAGE_PATH)
