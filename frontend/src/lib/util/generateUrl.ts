import type { Room } from '$lib/models/types';

export function generateUrl(room: Room): string {
	return `http://www.rauminfo.ethz.ch/RauminfoPre.do?region=${room.region.charAt(
		0
	)}&areal=${room.area.charAt(0)}&gebaeude=${room.building}&geschoss=${room.floor}&raumNr=${
		room.room_number
	}`;
}
