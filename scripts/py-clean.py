from pathlib import Path

import click


def remove(path: Path):
    if path.is_dir():
        for p in path.glob("*"):
            remove(p)
        path.rmdir()
    else:
        path.unlink()


def clean(path: Path, *patterns: str):
    for pattern in patterns:
        for p in path.glob(pattern):
            remove(p)


@click.command()
def main():
    cwd = Path.cwd()
    clean(
        cwd,
        "**/__pycache__/*.pyc",
        "appdata/.omu_cache",
        "appdata/assets",
        "appdata/data",
        "appdata/logs",
    )


if __name__ == "__main__":
    main()
