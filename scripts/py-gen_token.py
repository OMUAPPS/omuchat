import random
import string
from pathlib import Path

TOKEN_PATH = Path("appdata/token.txt")


def gen_token(length: int = 32):
    token = "".join(random.choices(string.ascii_letters + string.digits, k=length))
    TOKEN_PATH.write_text(token, encoding="utf-8")
    print(f"Token saved to {TOKEN_PATH}")


if __name__ == "__main__":
    gen_token(32)
