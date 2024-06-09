from .continuations import Continuation
from .metadataactions import MetadataActions
from .youtuberesponse import YoutubeResponse


class updated_metadata(YoutubeResponse):
    continuation: Continuation
    actions: MetadataActions
