import asyncio
from datetime import datetime, timedelta


class Throttle:
    def __init__(self, interval: timedelta):
        self.interval = interval
        self.waiter: asyncio.Event | None = None
        self.last_call = datetime.now() - interval

    async def wait(self):
        while self.waiter is not None:
            await self.waiter.wait()
        self.waiter = asyncio.Event()
        self.waiter.clear()
        elapsed = datetime.now() - self.last_call
        if elapsed < self.interval:
            await asyncio.sleep((self.interval - elapsed).total_seconds())
        self.last_call = datetime.now()
        self.waiter.set()
        self.waiter = None

    async def __aenter__(self):
        await self.wait()

    async def __aexit__(self, exc_type, exc_value, traceback):
        pass
