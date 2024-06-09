from omu import Plugin

from .version import VERSION

__version__ = VERSION
__all__ = ["plugin"]


def get_client():
    from .chatprovider import omu

    return omu


plugin = Plugin(
    get_client,
    isolated=True,
)
