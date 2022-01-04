import { api_url } from '../globals';
import type { Room } from 'src/models/types';
import { writable } from 'svelte/store';

export const filtered = writable<Room[]>([]);
export const rooms = writable<Room[]>([]);
export const roomsStudyPhase = writable<Room[]>([]);

const fetchRooms = async () => {
	const url = api_url + '/rooms';
	const response = await fetch(url);
	const r = await response.json();
	rooms.set(r);
	filtered.set(r);
};

const fetchRoomsStudyPhase = async () => {
	const url = api_url + '/rooms/lernphase';
	const response = await fetch(url);
	const r = await response.json();
	roomsStudyPhase.set(r);
};

fetchRooms();
fetchRoomsStudyPhase();
