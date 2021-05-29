export class Location {
  id: number;
  name: string;
  lat: number;
  lon: number;
  visit_count: number;

  constructor(id: number) {
    this.id = id;
    this.name = '';
    this.lat = 0;
    this.lon = 0;
    this.visit_count = 1;
  }
}