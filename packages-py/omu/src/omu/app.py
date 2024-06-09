from __future__ import annotations

from typing import Final, NotRequired, TypedDict

from omu.identifier import Identifier
from omu.interface import Keyable
from omu.localization import Locale, LocalizedText
from omu.model import Model


class AppMetadata(TypedDict):
    locale: Locale
    name: NotRequired[LocalizedText]
    description: NotRequired[LocalizedText]
    image: NotRequired[LocalizedText]
    site: NotRequired[LocalizedText]
    repository: NotRequired[LocalizedText]
    authors: NotRequired[LocalizedText]
    license: NotRequired[LocalizedText]
    tags: NotRequired[list[str]]


class AppJson(TypedDict):
    id: str
    version: NotRequired[str] | None
    url: NotRequired[str] | None
    metadata: NotRequired[AppMetadata] | None


class App(Keyable, Model[AppJson]):
    def __init__(
        self,
        id: Identifier | str,
        *,
        version: str | None = None,
        url: str | None = None,
        metadata: AppMetadata | None = None,
    ) -> None:
        if isinstance(id, str):
            id = Identifier.from_key(id)
        self.id: Final[Identifier] = id
        self.version = version
        self.url = url
        self.metadata = metadata

    @classmethod
    def from_json(cls, json: AppJson) -> App:
        id = Identifier.from_key(json["id"])
        return cls(
            id,
            version=json.get("version"),
            url=json.get("url"),
            metadata=json.get("metadata"),
        )

    def to_json(self) -> AppJson:
        return AppJson(
            id=self.key(),
            version=self.version,
            url=self.url,
            metadata=self.metadata,
        )

    def key(self) -> str:
        return self.id.key()

    def __hash__(self) -> int:
        return hash(self.key())

    def __repr__(self) -> str:
        return f"App({self.key()})"
