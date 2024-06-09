from collections.abc import Mapping

from .locale import Locale

type LocalizedText = Mapping[Locale, str] | str
type Translations = Mapping[str, Translations | LocalizedText]
