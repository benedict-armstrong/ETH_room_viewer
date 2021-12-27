import { api_url } from '../globals';
import type { Area, Building } from 'src/models/types';
import type { Room } from 'src/models/types';
import { writable } from 'svelte/store';
import { parseJSON } from 'date-fns';

export const areas = writable<Area[]>([]);
export const filtered = writable<Area[]>([]);

export const fetchAreas = async () => {
	const url = api_url + '/rooms';
	const response = await fetch(url);
	// console.log(response);
	const data: Room[] = await response.json();
	const buildings: Building[] = [];
	for (const room of data) {
		if (typeof room.next_booking === 'string') {
			// String to date
			room.next_booking = parseJSON(room.next_booking);
		}
		const b = buildings.find((b) => b.name === room.building);
		if (b) {
			b.rooms.push(room);
		} else {
			buildings.push({ name: room.building, rooms: [room] });
		}
	}

	for (const building of buildings) {
		// Sort rooms by next booking according to time descending
		building.rooms.sort((a, b) => {
			if (a.next_booking < b.next_booking) {
				return 1;
			} else if (a.next_booking > b.next_booking) {
				return -1;
			} else {
				return 0;
			}
		});
	}

	// sort buildings alphabetically by name
	// buildings.sort((a, b) => {
	// 	if (a.name < b.name) {
	// 		return -1;
	// 	} else if (a.name > b.name) {
	// 		return 1;
	// 	} else {
	// 		return 0;
	// 	}
	// });

	const areas_temp: Area[] = [];
	for (const building of buildings) {
		const a = areas_temp.find((a) => a.name === building.rooms[0].area);
		if (a) {
			a.buildings.push(building);
		} else {
			areas_temp.push({ name: building.rooms[0].area, buildings: [building] });
		}
	}

	areas.set(areas_temp);
	filtered.set(areas_temp);
};

fetchAreas();
