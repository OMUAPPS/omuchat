from marshmallowqa import Marshmallow, retrieve_cookies
from omu import Omu

from .const import APP
from .types import (
    GET_MESSAGES_ENDPOINT_TYPE,
    REFRESH_USERS_ENDPOINT_TYPE,
    Message,
    User,
)

omu = Omu(APP)
sessions: dict[str, Marshmallow] = {}


@omu.endpoints.bind(endpoint_type=GET_MESSAGES_ENDPOINT_TYPE)
async def get_messages(user: str) -> list[Message]:
    marshmallow = sessions[user]
    messages = await marshmallow.fetch_messages()
    return [Message(**message.model_dump()) for message in messages]


@omu.endpoints.bind(endpoint_type=REFRESH_USERS_ENDPOINT_TYPE)
async def refresh_users(_):
    cookies = retrieve_cookies(domain="marshmallow-qa.com")
    users: dict[str, User] = {}
    sessions.clear()
    for browser in cookies:
        marshmallow = await Marshmallow.from_cookies(
            cookies=cookies[browser],
        )
        user = await marshmallow.fetch_user()
        sessions[user.name] = marshmallow
        users[user.name] = User(**user.model_dump())
    return users
