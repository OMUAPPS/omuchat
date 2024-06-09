from omu.extension.endpoint.endpoint import EndpointType
from omu.extension.registry import RegistryType
from omu.extension.table import TableType

from .archive import Archive, ArchiveConfig
from .const import DEFAULT_CONFIG, IDENTIFIER

ARCHIVE_TABLE_TYPE = TableType.create_model(
    IDENTIFIER,
    "archive",
    Archive,
)
CONFIG_REGISTRY_TYPE = RegistryType[ArchiveConfig].create_json(
    IDENTIFIER,
    "config",
    DEFAULT_CONFIG,
)
OPEN_OUTPUT_DIR_ENDPOINT_TYPE = EndpointType[None, None].create_json(
    IDENTIFIER,
    "open_output_dir",
)
