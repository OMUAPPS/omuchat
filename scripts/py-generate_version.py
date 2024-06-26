import click
from helper import update_version


@click.command()
@click.option("--version", help="Version to set", default=None)
def main(version: str | None = None):
    update_version(version)


if __name__ == "__main__":
    main()
