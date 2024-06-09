from typing import TypedDict


class Color(TypedDict):
    r: int
    g: int
    b: int


class Badge(TypedDict):
    label: str
    url: str


class CommentData(TypedDict):
    id: str
    liveId: str
    userId: str
    name: str
    screenName: str
    hasGift: bool
    isOwner: bool
    isAnonymous: bool
    profileImage: str
    badges: list[Badge]
    timestamp: str
    comment: str
    displayName: str
    originalProfileImage: str
    isFirstTime: bool


class CommentMeta(TypedDict):
    no: int
    tc: int


class CommentServiceData(TypedDict):
    id: str
    name: str
    url: str
    write: bool
    speech: bool
    options: dict
    enabled: bool
    persist: bool
    translate: list
    color: Color


class Comment(TypedDict):
    id: str
    service: str
    name: str
    url: str
    color: Color
    data: CommentData
    meta: CommentMeta
    serviceData: CommentServiceData
