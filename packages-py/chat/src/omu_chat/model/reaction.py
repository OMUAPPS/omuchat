from __future__ import annotations

from typing import TypedDict

from omu.identifier import Identifier
from omu.model import Model


class ReactionJson(TypedDict):
    room_id: str
    reactions: dict[str, int]


class Reaction(Model[ReactionJson]):
    def __init__(
        self,
        *,
        room_id: Identifier,
        reactions: dict[str, int],
    ) -> None:
        self.room_id = room_id
        self.reactions = reactions

    @classmethod
    def from_json(cls, json: ReactionJson) -> Reaction:
        return cls(
            room_id=Identifier.from_key(json["room_id"]),
            reactions=json["reactions"],
        )

    def to_json(self) -> ReactionJson:
        return ReactionJson(
            room_id=self.room_id.key(),
            reactions=self.reactions,
        )
