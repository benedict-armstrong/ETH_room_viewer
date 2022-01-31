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
	url: string | undefined;
	latitude: number | undefined;
	longitude: number | undefined;
	//map_data?: number;
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

interface MapData {
	points: string;
	height: number;
	width: number;
}
