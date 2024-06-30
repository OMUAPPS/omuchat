from collections.abc import Mapping
from typing import TypedDict

from omu.extension.endpoint import EndpointType

from .const import PLUGIN_ID


class User(TypedDict):
    name: str
    screen_name: str
    image: str


REFRESH_USERS_ENDPOINT_TYPE = EndpointType[None, Mapping[str, User]].create_json(
    PLUGIN_ID,
    "refresh_users",
)


class Message(TypedDict):
    message_id: str
    liked: bool
    content: str
    like_token: str


GET_MESSAGES_ENDPOINT_TYPE = EndpointType[str, list[Message]].create_json(
    PLUGIN_ID,
    "get_messages",
)
