from typing import TypedDict

from .chatactions import ChatActions
from .contents import Continuations
from .tracking import TrackingParams
from .youtuberesponse import YoutubeResponse


class LiveChatContinuation(TrackingParams):
    continuations: Continuations
    actions: ChatActions


class ContinuationContents(TypedDict):
    liveChatContinuation: LiveChatContinuation


class live_chat(YoutubeResponse):
    continuationContents: ContinuationContents
