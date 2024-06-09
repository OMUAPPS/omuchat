from __future__ import annotations

from dataclasses import dataclass
from typing import NotRequired, TypedDict

from omu.model import Model


class GiftJson(TypedDict):
    id: str
    name: NotRequired[str] | None
    amount: NotRequired[int] | None
    is_paid: NotRequired[bool] | None
    image_url: NotRequired[str] | None


@dataclass(frozen=True, slots=True)
class Gift(Model[GiftJson]):
    id: str
    name: str | None = None
    amount: int | None = None
    is_paid: bool | None = None
    image_url: str | None = None

    @classmethod
    def from_json(cls, json: GiftJson) -> Gift:
        return cls(
            id=json["id"],
            name=json["name"],
            amount=json["amount"],
            is_paid=json["is_paid"],
            image_url=json.get("image_url") and json["image_url"],
        )

    def to_json(self) -> GiftJson:
        return {
            "id": self.id,
            "name": self.name,
            "amount": self.amount,
            "is_paid": self.is_paid,
            "image_url": self.image_url,
        }
