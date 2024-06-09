from typing import NotRequired, TypedDict

from .accessibility import Accessibility


class SimpleText(TypedDict):
    accessibility: NotRequired[Accessibility]
    simpleText: str
