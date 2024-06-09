from __future__ import annotations

from aiohttp import web
from loguru import logger
from omu.bytebuffer import ByteReader, ByteWriter
from omu.network.packet import Packet, PacketData
from omu.network.packet_mapper import PacketMapper

from .session import SessionConnection


class WebsocketsConnection(SessionConnection):
    def __init__(self, socket: web.WebSocketResponse) -> None:
        self.socket = socket

    @property
    def closed(self) -> bool:
        return self.socket.closed

    async def receive(self, packet_mapper: PacketMapper) -> Packet | None:
        msg = await self.socket.receive()
        if msg.type in {
            web.WSMsgType.CLOSE,
            web.WSMsgType.CLOSING,
            web.WSMsgType.CLOSED,
        }:
            return None
        if msg.type != web.WSMsgType.BINARY:
            raise RuntimeError(f"Unknown message type {msg.type}")

        if msg.data is None:
            raise RuntimeError("Received empty message")
        if msg.type == web.WSMsgType.TEXT:
            raise RuntimeError("Received text message")
        elif msg.type == web.WSMsgType.BINARY:
            with ByteReader(msg.data) as reader:
                event_type = reader.read_string()
                event_data = reader.read_byte_array()
            packet_data = PacketData(event_type, event_data)
            return packet_mapper.deserialize(packet_data)
        else:
            raise RuntimeError(f"Unknown message type {msg.type}")

    async def close(self) -> None:
        try:
            await self.socket.close()
        except Exception as e:
            logger.warning(f"Error closing socket: {e}")
            logger.error(e)

    async def send(self, packet: Packet, packet_mapper: PacketMapper) -> None:
        if self.closed:
            raise ValueError("Socket is closed")
        packet_data = packet_mapper.serialize(packet)
        writer = ByteWriter()
        writer.write_string(packet_data.type)
        writer.write_byte_array(packet_data.data)
        await self.socket.send_bytes(writer.finish())
