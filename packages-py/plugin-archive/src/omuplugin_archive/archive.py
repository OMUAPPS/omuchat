from typing import Literal, TypedDict

from omu.interface.keyable import Keyable
from omu.model import Model

type ArchiveStatus = Literal["pending", "processing", "completed", "failed"]


class ArchiveData(TypedDict):
    id: str
    url: str
    title: str | None
    description: str | None
    thumbnail: str | None
    published_at: str | None
    duration: int | None
    status: ArchiveStatus


class Archive(Model[ArchiveData], Keyable):
    def __init__(self, data: ArchiveData):
        self.id = data["id"]
        self.url = data["url"]
        self.title = data["title"]
        self.description = data["description"]
        self.thumbnail = data["thumbnail"]
        self.published_at = data["published_at"]
        self.duration = data["duration"]
        self.status: ArchiveStatus = data["status"]

    @classmethod
    def from_json(cls, json: ArchiveData) -> "Archive":
        return cls(json)

    def to_json(self) -> ArchiveData:
        return {
            "id": self.id,
            "url": self.url,
            "title": self.title,
            "description": self.description,
            "thumbnail": self.thumbnail,
            "published_at": self.published_at,
            "duration": self.duration,
            "status": self.status,
        }

    def key(self) -> str:
        return self.id


class YtDlpInfo(TypedDict):
    version: str
    git_head: str
    variant: str
    update_hint: str
    channel: str
    origin: str


class ArchiveLimit(TypedDict):
    size_mb: int
    count: int
    duration_days: int


class ArchiveConfig(TypedDict):
    active: bool
    yt_dlp_info: YtDlpInfo
    yt_dlp_options: dict[str, str | bool | int | list[int] | None]
    output_dir: str
    archive_limit: ArchiveLimit
