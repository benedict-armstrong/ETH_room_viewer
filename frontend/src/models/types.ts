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
	next_booking: Date | Date;
};

export interface Building {
	name: string;
	rooms: Room[];
}

export interface Area {
	name: string;
	buildings: Building[];
}

export interface Filter {
	name: string;
	values: string[];
	filterFunction: (array: Array<any>, value: string) => Array<any>;
}
