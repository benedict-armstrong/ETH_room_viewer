import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from 'src/Dto/room';
import { RoomFilter } from 'src/Models/filter';
import { Globals } from '../global/globals';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private httpClient: HttpClient, private globals: Globals) {}

  private baseUri: string = this.globals.backendUri + 'rooms';

  getAllRooms(): Observable<Room[]> {
    console.log('getting all Rooms');
    return this.httpClient.get<Room[]>(this.baseUri);
  }

  getAllRoomsFilter(filter: RoomFilter): Observable<Room[]> {
    console.log('getting all Rooms with Filter ');
    console.log(filter);
    let params = new HttpParams();
    if (filter.building) params.set('building', filter.building);
    if (filter.floor) params.set('floor', filter.floor);
    if (filter.area) params.set('area', filter.area);
    if (filter.capacity) params.set('capacity', filter.capacity);
    if (filter.room_type) params.set('room_type', filter.room_type);

    return this.httpClient.get<Room[]>(this.baseUri, { params: params });
  }
}
