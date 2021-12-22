import type { Room } from 'src/models/room';
import { writable } from 'svelte/store';

export const rooms = writable<Room[]>([]);

const fetchRooms = async () => {
	const url = 'http://localhost:81/api/v1/rooms';
	const response = await fetch(url);
	const data = await response.json();
	rooms.set(data);
};

fetchRooms();
