import random
import string
from pathlib import Path

from helper import update_version

TOKEN_PATH = Path("appdata/token.txt")


def gen_token(length: int = 32):
    token = "".join(random.choices(string.ascii_letters + string.digits, k=length))
    TOKEN_PATH.write_text(token, encoding="utf-8")
    print(f"Token saved to {TOKEN_PATH}")


def main():
    update_version()
    gen_token()


if __name__ == "__main__":
    main()
