from typing import NotRequired, TypedDict

from .accessibility import Accessibility


class Thumbnail(TypedDict):
    url: str
    width: int
    height: int


class Thumbnails(TypedDict):
    thumbnails: list[Thumbnail]


class Image(TypedDict):
    thumbnails: list[Thumbnail]
    accessibility: NotRequired[Accessibility]
