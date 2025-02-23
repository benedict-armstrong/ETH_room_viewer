import type { Booking, MapData, Room } from '@prisma/client';

export type RoomWithBookings = Room & {
	bookings: Booking[];
};

export type RoomWithBookingsAndMapData = RoomWithBookings & {
	map_data: MapData;
};

export interface Building {
	name: string;
	location: Location | undefined;
	rooms: RoomWithBookings[];
}

export interface Area {
	name: string;
	buildings: Building[];
}
export interface Filter {
	name: string;
	values: string[];
	filterFunction: (array: Array<Room>, value: string) => Array<Room>;
}
interface Location {
	longitude: number;
	latitude: number;
}
