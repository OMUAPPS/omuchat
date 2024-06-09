import abc


class Keyable(abc.ABC):
    @abc.abstractmethod
    def key(self) -> str: ...

    def __hash__(self) -> int:
        return hash(self.key())

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.key()})"
