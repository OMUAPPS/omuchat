from typing import NotRequired, TypedDict

from .chatactions import SimpleText
from .runs import Runs


class VideoViewCountRenderer(TypedDict):
    viewCount: SimpleText
    isLive: bool
    extraShortViewCount: SimpleText
    unlabeledViewCountValue: SimpleText
    originalViewCount: str


class ViewCount(TypedDict):
    videoViewCountRenderer: VideoViewCountRenderer


class UpdateViewershipAction(TypedDict):
    viewCount: ViewCount


class UpdateDateTextAction(TypedDict):
    dateText: SimpleText


class UpdateTitleAction(TypedDict):
    title: Runs


class UpdateDescriptionAction(TypedDict):
    description: Runs


class MetadataActionsItem(TypedDict):
    updateViewershipAction: NotRequired[UpdateViewershipAction]
    updateDateTextAction: NotRequired[UpdateDateTextAction]
    updateTitleAction: NotRequired[UpdateTitleAction]
    updateDescriptionAction: NotRequired[UpdateDescriptionAction]


type MetadataActions = list[MetadataActionsItem]
