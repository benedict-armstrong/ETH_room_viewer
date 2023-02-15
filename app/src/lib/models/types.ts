export type Room = {
	id: number | undefined;
	name: string;
	area: string;
	building: string;
	floor: string;
	region: string;
	room_number: string;
	room_type: string;
	capacity: number | undefined;
};

export interface RoomWithNextBooking extends Room {
	booking_start_time: Date | undefined;
	booking_end_time: Date | undefined;
	booking_name: string | undefined;
	booking_id: number | undefined;
}

export interface Building {
	name: string;
	location: Location | undefined;
	rooms: RoomWithNextBooking[];
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

interface Booking {
	id?: number;
	name: string;
	start_time: Date;
	end_time: Date;
}
