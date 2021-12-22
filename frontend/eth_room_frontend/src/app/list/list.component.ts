import { Component, OnInit } from '@angular/core';
import { Room } from 'src/Dto/room';
import { RoomFilter } from 'src/Models/filter';
import { RoomService } from '../service/room.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  rooms: Room[] = [];

  filter: RoomFilter | undefined;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.getAllRooms().subscribe((rooms) => (this.rooms = rooms));
  }

  updatedFilter(filter: RoomFilter): void {
    this.filter = filter;
    this.roomService
      .getAllRoomsFilter(filter)
      .subscribe((rooms) => (this.rooms = rooms));
  }
}
