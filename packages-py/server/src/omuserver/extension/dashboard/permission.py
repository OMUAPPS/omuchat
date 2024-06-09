from omu.extension.dashboard import (
    DASHBOARD_OPEN_APP_PERMISSION_ID,
    DASHBOARD_SET_PERMISSION_ID,
    DASHOBARD_APP_EDIT_PERMISSION_ID,
    DASHOBARD_APP_READ_PERMISSION_ID,
)
from omu.extension.permission import PermissionType

DASHBOARD_SET_PERMISSION = PermissionType(
    DASHBOARD_SET_PERMISSION_ID,
    {
        "level": "low",
        "name": {
            "en": "Dashboard Set Permission",
            "ja": "ダッシュボード設定権限",
        },
        "note": {
            "en": "Permission to set the dashboard session",
            "ja": "ダッシュボードセッションを設定する権限",
        },
    },
)
DASHBOARD_OPEN_APP_PERMISSION = PermissionType(
    DASHBOARD_OPEN_APP_PERMISSION_ID,
    {
        "level": "low",
        "name": {
            "en": "Dashboard Open App Permission",
            "ja": "アプリを開く権限",
        },
        "note": {
            "en": "Permission to open an app on the dashboard",
            "ja": "アプリを開く権限",
        },
    },
)
DASHOBARD_APP_READ_PERMISSION = PermissionType(
    DASHOBARD_APP_READ_PERMISSION_ID,
    {
        "level": "low",
        "name": {
            "en": "Access to Saved Apps on Dashboard",
            "ja": "保存されたアプリのリストの取得権限",
        },
        "note": {
            "en": "Permission to get the list of saved apps on the dashboard",
            "ja": "ダッシュボードに保存されたアプリのリストを取得する権限",
        },
    },
)
DASHOBARD_APP_EDIT_PERMISSION = PermissionType(
    DASHOBARD_APP_EDIT_PERMISSION_ID,
    {
        "level": "medium",
        "name": {
            "en": "Edit Saved Apps on Dashboard",
            "ja": "保存されたアプリの編集する権限",
        },
        "note": {
            "en": "Permission to edit saved apps on the dashboard",
            "ja": "ダッシュボードに保存されたアプリを編集する権限",
        },
    },
)
