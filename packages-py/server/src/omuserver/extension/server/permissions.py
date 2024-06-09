from omu.extension.permission import PermissionType
from omu.extension.server import (
    SERVER_APPS_READ_PERMISSION_ID,
    SERVER_SHUTDOWN_PERMISSION_ID,
)

SERVER_SHUTDOWN_PERMISSION = PermissionType(
    id=SERVER_SHUTDOWN_PERMISSION_ID,
    metadata={
        "level": "high",
        "name": {
            "en": "Shutdown Server",
            "ja": "サーバーをシャットダウン",
        },
        "note": {
            "en": "Permission to shutdown the server",
            "ja": "サーバーをシャットダウンできる権限",
        },
    },
)
SERVER_APPS_READ_PERMISSION = PermissionType(
    id=SERVER_APPS_READ_PERMISSION_ID,
    metadata={
        "level": "low",
        "name": {
            "en": "Get connected apps",
            "ja": "接続アプリ一覧取得",
        },
        "note": {
            "en": "Permission to get a list of apps connected to the server",
            "ja": "サーバーに接続されたアプリの一覧を取得する",
        },
    },
)
