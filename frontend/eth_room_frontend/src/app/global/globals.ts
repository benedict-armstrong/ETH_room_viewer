import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Globals {
  readonly backendUri: string = Globals.findBackendUrl();

  private static findBackendUrl(): string {
    if (window.location.port === '4200') {
      // local `ng serve`, backend at localhost:8080
      return 'http://localhost:81/api/v1/';
    } else {
      // assume deployed somewhere and backend is available at same host/port as frontend
      return 'https://' + window.location.host + '/api/v1/';
    }
  }
}
