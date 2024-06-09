from omu import Plugin

from .version import VERSION

__version__ = VERSION
__all__ = ["plugin"]


def get_client():
    from .plugin import client

    return client


plugin = Plugin(
    get_client,
)
