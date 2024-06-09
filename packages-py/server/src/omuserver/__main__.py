import asyncio
import io
import sys
import tracemalloc

import click
from loguru import logger
from omu.address import Address

from omuserver.config import Config
from omuserver.server.omuserver import OmuServer


def setup_logging():
    if isinstance(sys.stdout, io.TextIOWrapper):
        sys.stdout.reconfigure(encoding="utf-8")
    if isinstance(sys.stderr, io.TextIOWrapper):
        sys.stderr.reconfigure(encoding="utf-8")
    logger.add(
        "logs/{time:YYYY-MM-DD}.log",
        rotation="1 day",
        colorize=False,
        format=(
            "{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | "
            "{name}:{function}:{line} - {message}"
        ),
    )


@click.command()
@click.option("--debug", is_flag=True)
@click.option("--token", type=str, default=None)
def main(debug: bool, token: str | None):
    loop = asyncio.get_event_loop()

    config = Config()
    config.address = Address(
        host=None,
        port=26423,
        secure=False,
    )
    config.dashboard_token = token

    if debug:
        logger.warning("Debug mode enabled")
        config.strict_origin = False
        tracemalloc.start()

    server = OmuServer(config=config, loop=loop)

    logger.info("Starting server...")
    server.run()


if __name__ == "__main__":
    setup_logging()
    main()
