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
	next_booking: Date | undefined;
	booking_name?: string;
	url: string | undefined;
	latitude: number | undefined;
	longitude: number | undefined;
	points?: string;
	height?: number;
	width?: number;
};

export interface Building {
	name: string;
	location: Location | undefined;
	rooms: Room[];
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
