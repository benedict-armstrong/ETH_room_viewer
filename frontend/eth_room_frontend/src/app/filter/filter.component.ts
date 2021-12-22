import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RoomFilter } from 'src/Models/filter';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Output() updatedFilter = new EventEmitter<RoomFilter>();

  buildings = ['HG', 'CAB', 'ETZ', 'CHN'];
  areas = ['Zentrum', 'Hönggerberg', 'Other'];

  filter: RoomFilter = {
    area: '',
    building: '',
    floor: '',
    name: '',
    region: '',
    room_type: '',
    capacity: 0,
  };

  constructor() {}

  ngOnInit(): void {}

  updateFilter(): void {
    this.updatedFilter.emit(this.filter);
  }

  selectBuilding(building: string): void {
    this.filter.building = building;
    this.updateFilter();
  }

  selectArea(area: string): void {
    this.filter.area = area;
    this.updateFilter();
  }
}
