from __future__ import annotations

import abc


class Model[D](abc.ABC):
    @abc.abstractmethod
    def to_json(self) -> D: ...

    @classmethod
    @abc.abstractmethod
    def from_json(cls, json: D) -> Model[D]: ...
