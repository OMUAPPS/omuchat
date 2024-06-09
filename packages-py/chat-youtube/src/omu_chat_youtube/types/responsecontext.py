from typing import TypedDict


class ParamsItem(TypedDict):
    key: str
    value: str


class ServiceTrackingParamsItem(TypedDict):
    service: str
    params: list[ParamsItem]


type ServiceTrackingParams = list[ServiceTrackingParamsItem]


class MainAppWebResponseContext(TypedDict):
    datasyncId: str
    loggedOut: bool
    trackingParam: str


class WebResponseContextExtensionData(TypedDict):
    hasDecorated: bool


class ResponseContext(TypedDict):
    serviceTrackingParams: ServiceTrackingParams
    mainAppWebResponseContext: MainAppWebResponseContext
    webResponseContextExtensionData: WebResponseContextExtensionData
