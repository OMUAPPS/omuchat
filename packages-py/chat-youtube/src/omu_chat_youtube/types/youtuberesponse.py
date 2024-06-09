from .frameworkupdates import FrameworkUpdates
from .responsecontext import ResponseContext
from .tracking import TrackingParams


class YoutubeResponse(TrackingParams):
    responseContext: ResponseContext
    frameworkUpdates: FrameworkUpdates
