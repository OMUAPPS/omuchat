from collections.abc import Callable
from dataclasses import dataclass

from omuserver.server import Server

from omu.helper import Coro

from .client import Client


@dataclass(frozen=True, slots=True)
class Plugin:
    get_client: Callable[[], Client] | None = None
    on_start_server: Coro[[Server], None] | None = None
    on_stop_server: Coro[[Server], None] | None = None
    isolated: bool = False

    def __post_init__(self):
        if self.isolated:
            assert self.on_start_server is None, "Isolated plugins cannot have on_start"
            assert self.on_stop_server is None, "Isolated plugins cannot have on_stop"
            assert self.get_client is not None, "Isolated plugins must have get_client"
