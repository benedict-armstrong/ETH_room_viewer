from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Room:
    name: str
    building: str
    area: str
    region: str
    floor: str
    room_number: str
    capacity: int
    latitude: str
    longitude: str
    room_type: str
    room_data: bool
    id: Optional[int] = None

    def __str__(self):
        return f"{self.name} ({self.id})"


@dataclass
class Booking:
    name: str
    start_time: datetime
    end_time: datetime
    room_id: int
    id: Optional[int] = None

    def __str__(self):
        return f"{self.name} in room {self.room_id} ({self.id})"


@dataclass
class MapData:
    points: str
    height: str
    width: str
    room_id: int
    id: Optional[int] = None
