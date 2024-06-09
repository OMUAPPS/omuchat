from omu.extension.logger.logger_extension import LOGGER_LOG_PERMISSION_ID
from omu.extension.permission.permission import PermissionType

LOGGER_LOG_PERMISSION = PermissionType(
    id=LOGGER_LOG_PERMISSION_ID,
    metadata={
        "level": "low",
        "name": {
            "ja": "ログ出力",
            "en": "Log",
        },
        "note": {
            "ja": "ログ出力を行う権限",
            "en": "Permission to log",
        },
    },
)
