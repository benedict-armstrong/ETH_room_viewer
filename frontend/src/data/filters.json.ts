import type { Filter } from 'src/models/types';

const areaFilter: Filter = {
	name: 'Area',
	values: ['Zentrum', 'Hönggerberg', 'Other'],
	filterFunction: (rooms, value) => {
		if (value !== 'Other') {
			return rooms.filter((room) => room.area === value);
		} else {
			return rooms.filter((room) => room.area !== 'Hönggerberg' && room.area !== 'Zentrum');
		}
	}
};

const buildingFilter: Filter = {
	name: 'Building',
	values: ['HG', 'CAB', 'CHN', 'CLA', 'ETA', 'HIT'],
	filterFunction: (rooms, value) => {
		return rooms.filter((room) => room.building === value);
	}
};

const roomTypeFilter: Filter = {
	name: 'Room Type',
	values: ['Seminare / Kurse', 'Hoersaal', 'Sitzungszimmer', 'Computer', 'Sonstige'],
	filterFunction: (rooms, value) => {
		if (value !== 'Sonstige') {
			return rooms.filter((room) => room.room_type === value);
		} else {
			return rooms.filter(
				(room) =>
					room.room_type !== 'Seminare / Kurse' &&
					room.room_type !== 'Hoersaal' &&
					room.room_type !== 'Sitzungszimmer' &&
					room.room_type !== 'Computer'
			);
		}
	}
};

export const filters: Filter[] = [areaFilter];
