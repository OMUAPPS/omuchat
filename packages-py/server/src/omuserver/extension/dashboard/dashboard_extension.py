from asyncio import Future

from omu.app import App
from omu.errors import PermissionDenied
from omu.extension.dashboard import PermissionRequestPacket
from omu.extension.dashboard.dashboard_extension import (
    DASHBOARD_APP_TABLE_TYPE,
    DASHBOARD_OPEN_APP_ENDPOINT,
    DASHBOARD_OPEN_APP_PACKET,
    DASHBOARD_PERMISSION_ACCEPT_PACKET,
    DASHBOARD_PERMISSION_DENY_PACKET,
    DASHBOARD_PERMISSION_REQUEST_PACKET,
    DASHBOARD_PLUGIN_ACCEPT_PACKET,
    DASHBOARD_PLUGIN_DENY_PACKET,
    DASHBOARD_PLUGIN_REQUEST_PACKET,
    DASHBOARD_SET_ENDPOINT,
    DashboardSetResponse,
)
from omu.extension.dashboard.packets import PluginRequestPacket
from omu.identifier import Identifier

from omuserver.server import Server
from omuserver.session import Session
from omuserver.session.session import SessionType

from .permission import (
    DASHBOARD_OPEN_APP_PERMISSION,
    DASHBOARD_SET_PERMISSION,
    DASHOBARD_APP_EDIT_PERMISSION,
    DASHOBARD_APP_READ_PERMISSION,
)


class DashboardExtension:
    def __init__(self, server: Server) -> None:
        server.packet_dispatcher.register(
            DASHBOARD_PERMISSION_REQUEST_PACKET,
            DASHBOARD_PERMISSION_ACCEPT_PACKET,
            DASHBOARD_PERMISSION_DENY_PACKET,
            DASHBOARD_PLUGIN_REQUEST_PACKET,
            DASHBOARD_PLUGIN_ACCEPT_PACKET,
            DASHBOARD_PLUGIN_DENY_PACKET,
            DASHBOARD_OPEN_APP_PACKET,
        )
        server.permission_manager.register(
            DASHBOARD_SET_PERMISSION,
            DASHBOARD_OPEN_APP_PERMISSION,
            DASHOBARD_APP_READ_PERMISSION,
            DASHOBARD_APP_EDIT_PERMISSION,
        )
        server.packet_dispatcher.add_packet_handler(
            DASHBOARD_PERMISSION_ACCEPT_PACKET,
            self.handle_permission_accept,
        )
        server.packet_dispatcher.add_packet_handler(
            DASHBOARD_PERMISSION_DENY_PACKET,
            self.handle_permission_deny,
        )
        server.packet_dispatcher.add_packet_handler(
            DASHBOARD_PLUGIN_ACCEPT_PACKET,
            self.handle_plugin_accept,
        )
        server.packet_dispatcher.add_packet_handler(
            DASHBOARD_PLUGIN_DENY_PACKET,
            self.handle_plugin_deny,
        )

        server.endpoints.bind_endpoint(
            DASHBOARD_SET_ENDPOINT,
            self.handle_dashboard_set,
        )
        server.endpoints.bind_endpoint(
            DASHBOARD_OPEN_APP_ENDPOINT,
            self.handle_dashboard_open_app,
        )
        self.server = server
        self.apps = server.tables.register(DASHBOARD_APP_TABLE_TYPE)
        self.dashboard_session: Session | None = None
        self.pending_permission_requests: dict[str, PermissionRequestPacket] = {}
        self.permission_requests: dict[str, Future[bool]] = {}
        self.pending_plugin_requests: dict[str, PluginRequestPacket] = {}
        self.plugin_requests: dict[str, Future[bool]] = {}

    async def handle_dashboard_open_app(self, session: Session, app: App) -> None:
        if self.dashboard_session is None:
            raise ValueError("Dashboard session not set")
        await self.dashboard_session.send(
            DASHBOARD_OPEN_APP_PACKET,
            app,
        )

    async def handle_dashboard_set(
        self, session: Session, identifier: Identifier
    ) -> DashboardSetResponse:
        if session.kind != SessionType.DASHBOARD:
            raise PermissionDenied("Session is not a dashboard")
        self.dashboard_session = session
        session.event.disconnected += self._on_dashboard_disconnected
        await self.send_pending_permission_requests()
        return {"success": True}

    async def _on_dashboard_disconnected(self, session: Session) -> None:
        self.dashboard_session = None

    async def send_pending_permission_requests(self) -> None:
        if self.dashboard_session is None:
            raise ValueError("Dashboard session not set")
        for request in self.pending_permission_requests.values():
            await self.dashboard_session.send(
                DASHBOARD_PERMISSION_REQUEST_PACKET,
                request,
            )

    def verify_dashboard(self, session: Session) -> bool:
        if session == self.dashboard_session:
            return True
        msg = f"Session {session} is not the dashboard session"
        raise PermissionDenied(msg)

    async def handle_permission_accept(self, session: Session, request_id: str) -> None:
        self.verify_dashboard(session)
        if request_id not in self.permission_requests:
            raise ValueError(f"Permission request with id {request_id} does not exist")
        del self.pending_permission_requests[request_id]
        future = self.permission_requests.pop(request_id)
        future.set_result(True)

    async def handle_permission_deny(self, session: Session, request_id: str) -> None:
        self.verify_dashboard(session)
        if request_id not in self.permission_requests:
            raise ValueError(f"Permission request with id {request_id} does not exist")
        del self.pending_permission_requests[request_id]
        future = self.permission_requests.pop(request_id)
        future.set_result(False)

    async def request_permissions(self, request: PermissionRequestPacket) -> bool:
        if request.request_id in self.permission_requests:
            raise ValueError(
                f"Permission request with id {request.request_id} already exists"
            )
        future = Future[bool]()
        self.permission_requests[request.request_id] = future
        await self.notify_dashboard_permission_request(request)
        return await future

    async def notify_dashboard_permission_request(
        self, request: PermissionRequestPacket
    ) -> None:
        self.pending_permission_requests[request.request_id] = request
        if self.dashboard_session is not None:
            await self.dashboard_session.send(
                DASHBOARD_PERMISSION_REQUEST_PACKET,
                request,
            )

    async def handle_plugin_accept(self, session: Session, request_id: str) -> None:
        self.verify_dashboard(session)
        if request_id not in self.plugin_requests:
            raise ValueError(f"Plugin request with id {request_id} does not exist")
        del self.pending_plugin_requests[request_id]
        future = self.plugin_requests.pop(request_id)
        future.set_result(True)

    async def handle_plugin_deny(self, session: Session, request_id: str) -> None:
        self.verify_dashboard(session)
        if request_id not in self.plugin_requests:
            raise ValueError(f"Plugin request with id {request_id} does not exist")
        del self.pending_plugin_requests[request_id]
        future = self.plugin_requests.pop(request_id)
        future.set_result(False)

    async def request_plugins(self, request: PluginRequestPacket) -> bool:
        if request.request_id in self.plugin_requests:
            raise ValueError(
                f"Plugin request with id {request.request_id} already exists"
            )
        future = Future[bool]()
        self.plugin_requests[request.request_id] = future
        await self.notify_dashboard_plugin_request(request)
        return await future

    async def notify_dashboard_plugin_request(
        self, request: PluginRequestPacket
    ) -> None:
        self.pending_plugin_requests[request.request_id] = request
        if self.dashboard_session is not None:
            await self.dashboard_session.send(
                DASHBOARD_PLUGIN_REQUEST_PACKET,
                request,
            )
