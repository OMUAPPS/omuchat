from __future__ import annotations

from typing import NotRequired, TypedDict

from omu.identifier import Identifier
from omu.interface.keyable import Keyable
from omu.model import Model


class Choice(TypedDict):
    text: str
    ratio: float
    count: NotRequired[int]


class VoteJson(TypedDict):
    id: str
    room_id: str
    title: str
    choices: list[Choice]
    ended: bool
    total: int | None


class Vote(Keyable, Model[VoteJson]):
    def __init__(
        self,
        *,
        id: Identifier,
        room_id: Identifier,
        title: str,
        choices: list[Choice],
        ended: bool,
        total: int | None = None,
    ) -> None:
        self.id = id
        self.room_id = room_id
        self.title = title
        self.choices = choices
        self.total = total
        self.ended = ended

    @classmethod
    def from_json(cls, json: VoteJson) -> Vote:
        return Vote(
            id=Identifier.from_key(json["id"]),
            room_id=Identifier.from_key(json["room_id"]),
            title=json["title"],
            choices=json["choices"],
            total=json["total"],
            ended=json["ended"],
        )

    def to_json(self) -> VoteJson:
        return {
            "id": self.id.key(),
            "room_id": self.room_id.key(),
            "title": self.title,
            "choices": self.choices,
            "total": self.total,
            "ended": self.ended,
        }

    def key(self) -> str:
        return self.id.key()
