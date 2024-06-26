from omu.extension.i18n import I18N_SET_LOCALES_PERMISSION_ID
from omu.extension.i18n.i18n_extension import I18N_GET_LOCALES_PERMISSION_ID
from omu.extension.permission import PermissionType

I18N_SET_LOCALES_PERMISSION = PermissionType(
    id=I18N_SET_LOCALES_PERMISSION_ID,
    metadata={
        "level": "low",
        "name": {
            "en": "Set Locales",
            "ja": "ロケールの設定",
        },
        "note": {
            "en": "Permission to set locales such as language",
            "ja": "言語などのロケールを設定",
        },
    },
)
I18N_GET_LOCALES_PERMISSION = PermissionType(
    id=I18N_GET_LOCALES_PERMISSION_ID,
    metadata={
        "level": "low",
        "name": {
            "en": "Get Locales",
            "ja": "ロケールの取得",
        },
        "note": {
            "en": "Permission to get locales such as language",
            "ja": "言語などのロケールを取得",
        },
    },
)
