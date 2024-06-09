import abc


class Named(abc.ABC):
    @abc.abstractmethod
    def name(self) -> str: ...
