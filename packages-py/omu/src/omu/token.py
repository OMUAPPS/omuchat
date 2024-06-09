from __future__ import annotations

import abc
import json
from pathlib import Path

from omu.address import Address
from omu.app import App


class TokenProvider(abc.ABC):
    @abc.abstractmethod
    def get(self, server_address: Address, app: App) -> str | None:
        pass

    @abc.abstractmethod
    def store(self, server_address: Address, app: App, token: str) -> None:
        pass


class JsonTokenProvider(TokenProvider):
    def __init__(self, path: Path | None = None):
        path = path or Path.cwd() / ".omu_cache" / "tokens.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        self._path = path

    def get_store_key(self, server_address: Address, app: App) -> str:
        return f"{server_address.host}:{server_address.port}:{app.id.key()}"

    def get(self, server_address: Address, app: App) -> str | None:
        if not self._path.exists():
            return None
        tokens = json.loads(self._path.read_text(encoding="utf-8"))
        return tokens.get(self.get_store_key(server_address, app))

    def store(self, server_address: Address, app: App, token: str) -> None:
        tokens: dict[str, str] = {}
        if self._path.exists():
            tokens = json.loads(self._path.read_text(encoding="utf-8"))

        tokens[self.get_store_key(server_address, app)] = token
        self._path.write_text(json.dumps(tokens), encoding="utf-8")
