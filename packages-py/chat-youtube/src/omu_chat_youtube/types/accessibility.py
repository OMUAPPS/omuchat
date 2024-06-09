from typing import TypedDict


class AccessibilityData(TypedDict):
    label: str


class Accessibility(TypedDict):
    accessibilityData: AccessibilityData
