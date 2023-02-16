import type { Area, Building, RoomWithBookings } from '$lib/models/types';

export function groupIntoBuildings(rooms: RoomWithBookings[]): Building[] {
	const buildings = groupHelper(rooms);
	return buildings;
}

export function groupIntoAreas(rooms: RoomWithBookings[]): Area[] {
	const buildings = groupHelper(rooms);
	const areas_temp: Area[] = [];
	for (const building of buildings) {
		const a = areas_temp.find((a) => a.name === building.rooms[0].area);
		if (a) {
			a.buildings.push(building);
		} else {
			areas_temp.push({ name: building.rooms[0].area, buildings: [building] });
		}
	}

	return areas_temp;
}

function groupHelper(rooms: RoomWithBookings[]): Array<Building> {
	const buildings: Building[] = [];

	for (const room of rooms) {
		const b = buildings.find((b) => b.name === room.building);
		if (b) {
			b.rooms.push(room);
		} else {
			buildings.push({ name: room.building, location: undefined, rooms: [room] });
		}
	}

	return buildings;
}
