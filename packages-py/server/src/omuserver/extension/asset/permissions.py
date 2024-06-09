from omu.extension.asset import (
    ASSET_DOWNLOAD_MANY_PERMISSION_ID,
    ASSET_DOWNLOAD_PERMISSION_ID,
    ASSET_UPLOAD_MANY_PERMISSION_ID,
    ASSET_UPLOAD_PERMISSION_ID,
)
from omu.extension.permission import PermissionType

ASSET_UPLOAD_PERMISSION = PermissionType(
    id=ASSET_UPLOAD_PERMISSION_ID,
    metadata={
        "level": "low",
        "name": {
            "en": "File upload to storage",
            "ja": "このPCにファイルを保存する",
        },
        "note": {
            "en": "Upload a file to the storage on this PC.",
            "ja": "ファイルをこのPCにアップロードし保存します。",
        },
    },
)
ASSET_UPLOAD_MANY_PERMISSION = PermissionType(
    id=ASSET_UPLOAD_MANY_PERMISSION_ID,
    metadata={
        "level": "low",
        "name": {
            "en": "Multiple file upload to storage",
            "ja": "このPCに複数のファイルを保存する",
        },
        "note": {
            "en": "Upload multiple files to the storage on this PC.",
            "ja": "複数のファイルをこのPCにアップロードし保存します。",
        },
    },
)
ASSET_DOWNLOAD_PERMISSION = PermissionType(
    id=ASSET_DOWNLOAD_PERMISSION_ID,
    metadata={
        "level": "low",
        "name": {
            "en": "File download from storage",
            "ja": "このPCからファイルをダウンロードする",
        },
        "note": {
            "en": "Download a file that was previously uploaded.",
            "ja": "過去にアップロードされたファイルをダウンロードします。",
        },
    },
)
ASSET_DOWNLOAD_MANY_PERMISSION = PermissionType(
    id=ASSET_DOWNLOAD_MANY_PERMISSION_ID,
    metadata={
        "level": "low",
        "name": {
            "en": "Multiple file download from storage",
            "ja": "このPCから複数のファイルをダウンロードする",
        },
        "note": {
            "en": "Download multiple files that were previously uploaded.",
            "ja": "過去にアップロードされた複数のファイルをダウンロードします。",
        },
    },
)
