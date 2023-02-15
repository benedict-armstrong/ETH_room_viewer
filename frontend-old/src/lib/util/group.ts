import type { Area, Building, Room } from '$lib/models/types';
import { formatDate } from './formatDate';
import { generateUrl } from './generateUrl';

export function groupIntoBuildings(rooms: Array<Room>): Building[] {
	const buildings = groupHelper(rooms);
	return buildings;
}

export function groupIntoAreas(rooms: Array<Room>): Area[] {
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

function groupHelper(rooms: Array<Room>): Array<Building> {
	const buildings: Building[] = [];

	for (const room of rooms) {
		room.next_booking = formatDate(room.next_booking);
		room.url = generateUrl(room);

		const b = buildings.find((b) => b.name === room.building);
		if (b) {
			b.rooms.push(room);
		} else {
			const l = room.latitude ? { latitude: room.latitude, longitude: room.longitude } : undefined;
			buildings.push({ name: room.building, location: l, rooms: [room] });
		}
	}

	for (const building of buildings) {
		// Sort rooms by next booking according to time descending
		building.rooms.sort((a, b) => {
			if (!a.next_booking) {
				return 1;
			}
			if (!b.next_booking) {
				return -1;
			}
			if (a.next_booking < b.next_booking) {
				return 1;
			} else if (a.next_booking > b.next_booking) {
				return -1;
			} else {
				return 0;
			}
		});
	}

	return buildings;
}
