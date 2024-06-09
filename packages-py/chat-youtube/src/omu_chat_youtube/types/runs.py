from typing import NotRequired, TypedDict

from .image import Image
from .urlendpoint import NavigationEndpoint


class Emoji(TypedDict):
    emojiId: str
    shortcuts: list[str]
    searchTerms: list[str]
    image: Image
    isCustomEmoji: bool


class TextRun(TypedDict):
    text: str


class LinkRun(TypedDict):
    """{
        "text": "https://shop.hololivepro.com/products...",
        "navigationEndpoint": {
            "clickTrackingParams": "CAEQl98BIhMIpPTD9bu_hAMVqdA0Bx0ZlAlV",
            "commandMetadata": {
                "webCommandMetadata": {
                    "url": "https://www.youtube.com/redirect?event=live_chat\u0026redir_token=QUFFLUhqbnZxMDlGNUhELWo0MGNCTWRqVE00X2ZSVFRZZ3xBQ3Jtc0tuNlB5UG4waDhiZzZUcFVpNV96Y3JnczBmQ3N6b0dLRlRibnhiWmR5T1lhdzVHYXExR2dDb3hzNnZkT2VvWkFTdXFnS0sxN25EUTBwVXlPR1RNSnY2Y21BQktVS01fMlloNkhDYWdyeVhCc2JMdzJDMA\u0026q=https%3A%2F%2Fshop.hololivepro.com%2Fproducts%2Fnekomataokayu_bd2024",
                    "webPageType": "WEB_PAGE_TYPE_UNKNOWN",
                    "rootVe": 83769,
                }
            },
            "urlEndpoint": {
                "url": "https://www.youtube.com/redirect?event=live_chat\u0026redir_token=QUFFLUhqbnZxMDlGNUhELWo0MGNCTWRqVE00X2ZSVFRZZ3xBQ3Jtc0tuNlB5UG4waDhiZzZUcFVpNV96Y3JnczBmQ3N6b0dLRlRibnhiWmR5T1lhdzVHYXExR2dDb3hzNnZkT2VvWkFTdXFnS0sxN25EUTBwVXlPR1RNSnY2Y21BQktVS01fMlloNkhDYWdyeVhCc2JMdzJDMA\u0026q=https%3A%2F%2Fshop.hololivepro.com%2Fproducts%2Fnekomataokayu_bd2024",
                "target": "TARGET_NEW_WINDOW",
                "nofollow": true,
            },
        },
    }"""

    text: str
    navigationEndpoint: NotRequired[NavigationEndpoint]


class EmojiRun(TypedDict):
    emoji: Emoji


type RunsItem = TextRun | LinkRun | EmojiRun


class Runs(TypedDict):
    runs: list[RunsItem]
