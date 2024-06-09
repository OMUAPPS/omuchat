from omu_chat.model import Author, Channel, Message, Provider, Room, Vote

from .event import TableEvent


class events:
    message = TableEvent[Message](lambda chat: chat.messages)
    author = TableEvent[Author](lambda chat: chat.authors)
    channel = TableEvent[Channel](lambda chat: chat.channels)
    provider = TableEvent[Provider](lambda chat: chat.providers)
    room = TableEvent[Room](lambda chat: chat.rooms)
    vote = TableEvent[Vote](lambda chat: chat.votes)
