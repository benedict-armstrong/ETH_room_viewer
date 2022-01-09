import { parseJSON } from 'date-fns';
import type { Area, Building, Room } from '$lib/models/types';

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
		if (typeof room.next_booking === 'string' && room.next_booking != 'null') {
			// String to date
			room.next_booking = parseJSON(room.next_booking);
		}
		room.url = `http://www.rauminfo.ethz.ch/RauminfoPre.do?region=${room.region.charAt(
			0
		)}&areal=${room.area.charAt(0)}&gebaeude=${room.building}&geschoss=${room.floor}&raumNr=${
			room.room_number
		}`;

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
