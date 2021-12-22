import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ListComponent } from './list/list.component';
import { RoomListItemComponent } from './room-list-item/room-list-item.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, ListComponent, RoomListItemComponent, FilterComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
