from typing import Literal, NotRequired, TypedDict

from omu_chat_youtube.types.frameworkupdates import FrameworkUpdates

from .image import Thumbnails
from .responsecontext import ResponseContext
from .simpletext import SimpleText
from .tracking import ClickTrackingParams, TrackingParams
from .urlendpoint import Command


class MiniplayerRenderer(TypedDict):
    playbackMode: Literal["PLAYBACK_MODE_ALLOW"]


class Miniplayer(TypedDict):
    miniplayerRenderer: MiniplayerRenderer


class PlayabilityStatus(TypedDict):
    status: Literal["OK"]
    playableInEmbed: bool
    miniplayer: Miniplayer
    contextParams: str


class StreamingDataFormatItem(TypedDict):
    itag: int
    url: str
    mimeType: str
    bitrate: int
    width: int
    height: int
    lastModified: str
    contentLength: str
    quality: Literal["medium"]
    fps: int
    qualityLabel: str
    projectionType: str
    averageBitrate: int
    audioQuality: Literal["AUDIO_QUALITY_LOW"]
    approxDurationMs: str
    audioSampleRate: str
    audioChannels: int


class Range(TypedDict):
    start: str
    end: str


class ColorInfo(TypedDict):
    primaries: Literal["COLOR_PRIMARIES_BT709"]
    transferCharacteristics: Literal["COLOR_TRANSFER_CHARACTERISTICS_BT709"]
    matrixCoefficients: Literal["COLOR_MATRIX_COEFFICIENTS_BT709"]


class StreamingDataAdaptiveFormatItem(TypedDict):
    itag: int
    url: str
    mimeType: str
    bitrate: int
    width: int
    height: int
    initRange: Range
    indexRange: Range
    lastModified: str
    contentLength: str
    quality: Literal["hd1080", "hd720", "large", "medium", "small", "tiny"]
    fps: int
    qualityLabel: str
    projectionType: Literal["RECTANGULAR"]
    averageBitrate: int
    colorInfo: NotRequired[ColorInfo]
    approxDurationMs: str


class StreamingData(TypedDict):
    expiresInSeconds: str
    formats: list[StreamingDataFormatItem]
    adaptiveFormats: list[StreamingDataAdaptiveFormatItem]
    serverAbrStreamingUrl: str


class PlayerAdParams(TypedDict):
    showContentThumbnail: bool
    enabledEngageTypes: str


class GutParams(TypedDict):
    tag: str


class PlayerLegacyDesktopWatchAdsRenderer(TypedDict):
    playerAdParams: PlayerAdParams
    gutParams: GutParams
    showCompanion: bool
    showInstream: bool
    useGut: bool


class PayerAdsItem(TypedDict):
    playerLegacyDesktopWatchAdsRenderer: PlayerLegacyDesktopWatchAdsRenderer


class BaseUrl(TypedDict):
    baseUrl: str
    elapsedMediaTimeSeconds: NotRequired[int]


class PlaybackTracking(TypedDict):
    videostatsPlaybackUrl: BaseUrl
    videostatsDelayplayUrl: BaseUrl
    videostatsWatchtimeUrl: BaseUrl
    ptrackingUrl: BaseUrl
    qoeUrl: BaseUrl
    atrUrl: BaseUrl
    videostatsScheduledFlushWalltimeSeconds: list[int]
    videostatsDefaultFlushIntervalSeconds: int


class CaptionTracksItem(TypedDict):
    baseUrl: str
    name: SimpleText
    vssId: str
    languageCode: str
    kind: str
    isTranslatable: bool
    trackName: str


class AudioTracksItem(TypedDict):
    captionTrackIndices: list[int]


class TranslationLanguagesItem(TypedDict):
    languageCode: str
    languageName: SimpleText


class PlayerCaptionsTracklistRenderer(TypedDict):
    captionTracks: list[CaptionTracksItem]
    audioTracks: list[AudioTracksItem]
    translationLanguages: list[TranslationLanguagesItem]
    defaultAudioTrackIndex: int


class Captions(TypedDict):
    playerCaptionsTracklistRenderer: PlayerCaptionsTracklistRenderer


class VideoDetails(TypedDict):
    videoId: str
    title: str
    lengthSeconds: str
    keywords: list[str]
    channelId: str
    isOwnerViewing: bool
    shortDescription: str
    isCrawlable: bool
    thumbnail: Thumbnails
    allowRatings: bool
    viewCount: str
    author: str
    isLowLatencyLiveStream: bool
    isPrivate: bool
    isUnpluggedCorpus: bool
    latencyClass: Literal["MDE_STREAM_OPTIMIZATIONS_RENDERER_LATENCY_LOW"]
    isLiveContent: bool


class AudioConfig(TypedDict):
    loudnessDb: float
    perceptualLoudnessDb: float
    enablePerFormatLoudness: bool


class StreamSelectionConfig(TypedDict):
    maxBitrate: str


class DynamicReadaheadConfig(TypedDict):
    maxReadAheadMediaTimeMs: int
    minReadAheadMediaTimeMs: int
    readAheadGrowthRateMs: int


class MediaUstreamerRequestConfig(TypedDict):
    videoPlaybackUstreamerConfig: str


class StartMinReadaheadPolicyItem(TypedDict):
    minReadaheadMs: int


class PlaybackStartPolicy(TypedDict):
    startMinReadaheadPolicy: list[StartMinReadaheadPolicyItem]


class ServerPlaybackStartConfig(TypedDict):
    enable: bool
    playbackStartPolicy: PlaybackStartPolicy


class MediaCommonConfig(TypedDict):
    dynamicReadaheadConfig: DynamicReadaheadConfig
    mediaUstreamerRequestConfig: MediaUstreamerRequestConfig
    useServerDrivenAbr: bool
    serverPlaybackStartConfig: ServerPlaybackStartConfig


class WebPlayerShareEntityServiceEndpoint(TypedDict):
    serializedShareEntity: str


class GetSharePanelCommand(Command):
    webPlayerShareEntityServiceEndpoint: WebPlayerShareEntityServiceEndpoint


class SubscribeEndpoint(TypedDict):
    channelIds: list[str]
    params: str


class SubscribeCommand(Command):
    subscribeCommand: SubscribeEndpoint


class UnsubscribeEndpoint(TypedDict):
    channelIds: list[str]
    params: str


class UnsubscribeCommand(Command):
    unsubscribeEndpoint: UnsubscribeEndpoint


class PlaylistEditEndpointActionsItem(TypedDict):
    addedVideoId: str
    action: Literal["ACTION_ADD_VIDEO", "ACTION_REMOVE_VIDEO_BY_VIDEO_ID"]


class PlaylistEditEndpoint(TypedDict):
    playlistId: str
    actions: list[PlaylistEditEndpointActionsItem]


class AddToWatchLaterCommand(Command):
    playlistEditEndpoint: PlaylistEditEndpoint


class RemoveFromWatchLaterCommand(Command):
    playlistEditEndpoint: PlaylistEditEndpoint


class WebPlayerActionsPorting(TypedDict):
    getSharePanelCommand: GetSharePanelCommand
    subscribeCommand: SubscribeCommand
    unsubscribeCommand: UnsubscribeCommand
    addToWatchLaterCommand: AddToWatchLaterCommand
    removeFromWatchLaterCommand: RemoveFromWatchLaterCommand


class WebPlayerConfig(TypedDict):
    useCobaltTvosDash: bool
    webPlayerActionsPorting: WebPlayerActionsPorting


class PlayerConfig(TypedDict):
    audioConfig: AudioConfig
    streamSelectionConfig: StreamSelectionConfig
    mediaCommonConfig: MediaCommonConfig
    webPlayerConfig: WebPlayerConfig


class PlayerStoryboardSpecRenderer(TypedDict):
    spec: str
    recommendedLevel: int
    highResolutionRecommendedLevel: int


class Storyboards(TypedDict):
    playerStoryboardSpecRenderer: PlayerStoryboardSpecRenderer


class Embed(TypedDict):
    iframeUrl: str
    width: int
    height: int


class LiveBroadcastDetails(TypedDict):
    isLiveNow: bool
    startTimestamp: str
    endTimestamp: str


class PlayerMicroformatRenderer(TypedDict):
    thumbnail: Thumbnails
    embed: Embed
    title: SimpleText
    description: SimpleText
    lengthSeconds: str
    ownerProfileUrl: str
    externalChannelId: str
    isFamilySafe: bool
    availableCountries: list[str]
    isUnlisted: bool
    hasYpcMetadata: bool
    viewCount: str
    category: str
    publishDate: str
    ownerChannelName: str
    liveBroadcastDetails: LiveBroadcastDetails
    uploadDate: str
    isShortsEligible: bool


class Microformat(TypedDict):
    playerMicroformatRenderer: PlayerMicroformatRenderer


class ChangeEngagementPanelVisibilityAction(TypedDict):
    targetId: str
    visibility: Literal["ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]


class SimpleCardTeaserCommand(ClickTrackingParams):
    changeEngagementPanelVisibilityAction: ChangeEngagementPanelVisibilityAction


class SimpleCardTeaserRenderer(TrackingParams):
    message: SimpleText
    prominent: bool
    logVisibilityUpdates: bool
    onTapCommand: SimpleCardTeaserCommand


class Teaser(TypedDict):
    simpleCardTeaserRenderer: SimpleCardTeaserRenderer


class CueRangesItem(TypedDict):
    startCardActiveMs: str
    endCardActiveMs: str
    teaserDurationMs: str
    iconAfterTeaserMs: str


class CardRenderer(TrackingParams):
    teaser: Teaser
    cueRanges: list[CueRangesItem]


class CardCollectionRendererCardsItem(TypedDict):
    cardRenderer: CardRenderer


class CardCollectionRendererIcon(TypedDict):
    infoCardIconRenderer: TrackingParams


class CardCollectionRendererCloseButton(TypedDict):
    infoCardIconRenderer: TrackingParams


class CardCollectionRenderer(TrackingParams):
    cards: list[CardCollectionRendererCardsItem]
    headerText: SimpleText
    icon: CardCollectionRendererIcon
    closeButton: CardCollectionRendererCloseButton
    allowTeaserDismiss: bool
    logIconVisibilityUpdates: bool


class Cards(TypedDict):
    cardCollectionRenderer: CardCollectionRenderer


class InterpreterSafeUrl(TypedDict):
    privateDoNotAccessOrElseTrustedResourceUrlWrappedValue: str


class BotguardData(TypedDict):
    program: str
    interpreterSafeUrl: InterpreterSafeUrl
    serverEnvironment: int


class PlayerAttestationRenderer(TypedDict):
    challenge: str
    botguardData: BotguardData


class Attestation(TypedDict):
    playerAttestationRenderer: PlayerAttestationRenderer


class AdTimeOffset(TypedDict):
    offsetStartMilliseconds: str
    offsetEndMilliseconds: str


class AdPlacementConfig(TypedDict):
    kind: Literal[
        "AD_PLACEMENT_KIND_START",
        "AD_PLACEMENT_KIND_MILLISECONDS",
        "AD_PLACEMENT_KIND_END",
    ]
    adTimeOffset: AdTimeOffset
    hideCueRangeMarker: bool


class AdPlacementRendererConfig(TypedDict):
    adPlacementConfig: AdPlacementConfig


class ClientForecastingAdRenderer(TypedDict):
    hack: bool


class AdBreakServiceRenderer(TypedDict):
    prefetchMilliseconds: str
    getAdBreakUrl: str


class AdPlacementRendererRenderer(TypedDict):
    clientForecastingAdRenderer: NotRequired[ClientForecastingAdRenderer]
    adBreakServiceRenderer: NotRequired[AdBreakServiceRenderer]
    adBreakServiceRenderer: NotRequired[AdBreakServiceRenderer]


class AdSlotLoggingData(TypedDict):
    serializedSlotAdServingDataEntry: str


class AdPlacementRenderer(TypedDict):
    config: AdPlacementRendererConfig
    renderer: AdPlacementRendererRenderer
    adSlotLoggingData: AdSlotLoggingData


class AdPlacementsItem(TypedDict):
    adPlacementRenderer: AdPlacementRenderer


class ytInitialPlayerResponse(TrackingParams):
    responseContext: ResponseContext
    playabilityStatus: PlayabilityStatus
    streamingData: StreamingData
    playerAds: list[PayerAdsItem]
    playbackTracking: PlaybackTracking
    captions: Captions
    videoDetails: VideoDetails
    playerConfig: PlayerConfig
    storyboards: Storyboards
    microformat: Microformat
    cards: Cards
    attestation: Attestation
    adPlacements: list[AdPlacementsItem]
    adBreakHeartbeatParams: str
    frameworkUpdates: FrameworkUpdates
