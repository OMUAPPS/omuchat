from typing import Literal, NotRequired, TypedDict

from .tracking import ClickTrackingParams


class UrlEndpoint(TypedDict):
    url: str
    target: Literal["TARGET_NEW_WINDOW"]
    nofollow: bool


class WebCommandMetadata(TypedDict):
    ignoreNavigation: NotRequired[bool]
    sendPost: NotRequired[bool]
    apiUrl: NotRequired[str]


class CommandMetadata(TypedDict):
    webCommandMetadata: WebCommandMetadata


class LiveChatItemContextMenuEndpoint(TypedDict):
    params: str


class ContextMenuEndpoint(TypedDict):
    commandMetadata: CommandMetadata
    liveChatItemContextMenuEndpoint: LiveChatItemContextMenuEndpoint


class Command(ClickTrackingParams):
    commandMetadata: NotRequired[CommandMetadata]


class NavigationEndpoint(ClickTrackingParams):
    commandMetadata: NotRequired[CommandMetadata]
    urlEndpoint: NotRequired[UrlEndpoint]
