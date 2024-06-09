import re
from pathlib import Path


def get_version(project: Path) -> str:
    toml = project / "pyproject.toml"
    version_match = re.search(r"version\s*=\s*\"([0-9.]*)\"", toml.read_text())
    if version_match is None:
        raise ValueError(f"Could not find version in {toml}")
    return version_match.group(1)


def set_version(project: Path, version: str):
    toml = project / "pyproject.toml"
    toml.write_text(
        re.sub(
            r"version\s*=\s*\"([0-9.]*)\"", f'version = "{version}"', toml.read_text()
        )
    )


def main():
    print("Current version:", get_version(Path.cwd()))
    version = input("New version: ")
    set_version(Path.cwd(), version)
    for project in Path.cwd().glob("packages-py/*"):
        print(f"[{project.name}] {get_version(project)} -> {version}")
        set_version(project, version)


if __name__ == "__main__":
    main()
