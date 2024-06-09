from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Address:
    host: str | None
    port: int
    secure: bool = False
