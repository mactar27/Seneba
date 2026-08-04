export interface Driver {
  id: string
  user_id: string
  full_name: string
  phone: string
  profile_image_url?: string
  vehicle_make?: string
  vehicle_model?: string
  vehicle_year?: number
  vehicle_color?: string
  license_plate?: string
  license_document_url?: string
  registration_document_url?: string
  service_area?: "urbain" | "interurbain" | "les_deux"
  vehicle_type?: "berline" | "7_places" | "suv" | "van"
  is_available: boolean
  is_verified: boolean
  average_rating: number
  total_rides: number
  current_latitude?: number
  current_longitude?: number
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  full_name: string
  phone: string
  email?: string
  profile_image_url?: string
  home_address?: string
  home_latitude?: number
  home_longitude?: number
  work_address?: string
  work_latitude?: number
  work_longitude?: number
  total_rides: number
  created_at: string
  updated_at: string
}

export interface Ride {
  id: string
  client_id: string
  client_user_id?: string
  driver_id?: string
  pickup_address: string
  pickup_latitude: number
  pickup_longitude: number
  destination_address: string
  destination_latitude: number
  destination_longitude: number
  distance_km?: number
  duration_minutes?: number
  base_fare: number
  distance_fare?: number
  time_fare?: number
  total_fare?: number
  tarif_estime?: number
  inclut_peage?: boolean
  region_depart_id?: number
  region_arrivee_id?: number
  payment_method?: "cash" | "wave" | "orange_money"
  status: "requested" | "accepted" | "arriving" | "in_progress" | "completed" | "cancelled"
  client_name?: string
  client_phone?: string
  requested_at: string
  accepted_at?: string
  started_at?: string
  completed_at?: string
  cancelled_at?: string
  cancelled_by?: "client" | "driver" | "system"
  rating?: number
  rating_comment?: string
  created_at: string
  // Joined driver data
  driver?: Driver
}

export interface DriverEarning {
  id: string
  driver_id: string
  ride_id?: string
  amount: number
  commission_rate: number
  commission_amount?: number
  net_amount?: number
  earning_type: "ride" | "bonus" | "tip"
  created_at: string
}

export type RideStatus = Ride["status"]

export interface RegionSenegal {
  id: number
  nom_region: string
  chef_lieu: string
}
