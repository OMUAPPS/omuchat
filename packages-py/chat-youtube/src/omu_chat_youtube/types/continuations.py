from typing import TypedDict

from .tracking import ClickTrackingParams


class InvalidationId(TypedDict):
    objectSource: int
    objectId: str
    topic: str
    subscribeToGcmTopics: bool
    protoCreationTimestampMs: str


class InvalidationContinuationData(ClickTrackingParams):
    invalidationId: InvalidationId
    timeoutMs: int
    continuation: str


class ContinuationsItem(TypedDict):
    invalidationContinuationData: InvalidationContinuationData


type Continuations = list[ContinuationsItem]


class TimedContinuationData(TypedDict):
    timeoutMs: int
    continuation: str


class Continuation(TypedDict):
    timedContinuationData: TimedContinuationData
