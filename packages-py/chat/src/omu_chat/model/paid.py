from __future__ import annotations

from typing import TypedDict

from omu.model import Model


class PaidJson(TypedDict):
    amount: float
    currency: str


class Paid(Model[PaidJson]):
    def __init__(self, *, amount: float, currency: str) -> None:
        self.amount = amount
        self.currency = currency

    @classmethod
    def from_json(cls, json: PaidJson) -> Paid:
        return cls(amount=json["amount"], currency=json["currency"])

    def to_json(self) -> PaidJson:
        return {"amount": self.amount, "currency": self.currency}

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Paid):
            return NotImplemented
        return self.amount == other.amount and self.currency == other.currency

    def __repr__(self) -> str:
        return f"Paid(amount={self.amount}, currency={self.currency})"
