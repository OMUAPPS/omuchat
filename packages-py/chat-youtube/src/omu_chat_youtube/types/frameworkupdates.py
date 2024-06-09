from typing import Literal, NotRequired, TypedDict


class Content(TypedDict):
    content: str


class LikeCountEntity1(TypedDict):
    key: str
    likeCountIfLiked: Content
    likeCountIfIndifferent: Content
    likeButtonA11yText: Content
    likeCountIfLikedNumber: str
    likeCountIfIndifferentNumber: str


class LikeCountEntity2(TypedDict):
    likeCountIfLiked: Content
    likeCountIfDisliked: Content
    likeCountIfIndifferent: Content
    expandedLikeCountIfLiked: Content
    expandedLikeCountIfDisliked: Content
    expandedLikeCountIfIndifferent: Content
    likeCountLabel: Content
    likeButtonA11yText: Content
    likeCountIfLikedNumber: str
    likeCountIfDislikedNumber: str
    likeCountIfIndifferentNumber: str
    shouldExpandLikeCount: bool
    sentimentFactoidA11yTextIfLiked: Content
    sentimentFactoidA11yTextIfDisliked: Content


class LikeCountEntityPayload(TypedDict):
    likeCountEntity: LikeCountEntity1 | LikeCountEntity2


class EngagementToolbarStateEntityPayload(TypedDict):
    key: str
    likeState: NotRequired[Literal["TOOLBAR_LIKE_STATE_INDIFFERENT"]]


class EngagementToolbarStateEntityPayloadPayload(TypedDict):
    engagementToolbarStateEntityPayload: EngagementToolbarStateEntityPayload


class Duration(TypedDict):
    seconds: str


class ReactionBucketsItem(TypedDict):
    totalReactions: int
    duration: Duration
    intensityScore: int


type ReactionBuckets = list[ReactionBucketsItem]


class EmojiFountainDataEntity(TypedDict):
    key: str
    reactionBuckets: ReactionBuckets
    updateTimeUsec: str


class EmojiFountainDataEntityPayload(TypedDict):
    emojiFountainDataEntity: EmojiFountainDataEntity


class BooleanEntity(TypedDict):
    key: str
    value: bool


class BooleanEntityPayload(TypedDict):
    booleanEntity: BooleanEntity


class OfflineabilityEntity(TypedDict):
    key: str
    addToOfflineButtonState: Literal["ADD_TO_OFFLINE_BUTTON_STATE_UNKNOWN"]


class OfflineabilityEntityPayload(TypedDict):
    offlineabilityEntity: OfflineabilityEntity


class Mutation(TypedDict):
    entityKey: str
    type: Literal["ENTITY_MUTATION_TYPE_REPLACE"]
    payload: (
        LikeCountEntityPayload
        | EngagementToolbarStateEntityPayloadPayload
        | EmojiFountainDataEntityPayload
        | BooleanEntityPayload
        | OfflineabilityEntityPayload
    )


type Mutations = list[Mutation]


class Timestamp(TypedDict):
    seconds: str
    nanos: int


class EntityBatchUpdate(TypedDict):
    mutations: Mutations
    timestamp: Timestamp


class FrameworkUpdates(TypedDict):
    entityBatchUpdate: EntityBatchUpdate
