export class CreateGtfsRouteDto {
  id: number;
  agency: string;
  intermediary: string;
  desc: string;
  route_type: number;
  loc_origin_name: string;
  //loc_origin_id: string;
  loc_destination_name: string;
  //loc_destination_id: string;
  departure_time: string;
  arrival_time: string;
}
