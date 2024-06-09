from omu import Plugin

from .onecomme import start_onecomme
from .version import VERSION

__version__ = VERSION
__all__ = ["plugin"]


def get_client():
    from .plugin import client

    return client


plugin = Plugin(
    get_client,
    on_start_server=start_onecomme,
)
