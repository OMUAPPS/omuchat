def test_directory_traversal_attack():
    from pathlib import Path

    from omuserver.helper import safe_path

    root = Path("/home/omu")
    path = Path("/home/omu/../../etc/passwd")
    try:
        safe_path(root, path)
    except ValueError:
        pass
    else:
        raise AssertionError("Expected ValueError")

    root = Path("/home/omu")
    path = Path("/home/omu/etc/passwd")
    safe_path(root, path)
