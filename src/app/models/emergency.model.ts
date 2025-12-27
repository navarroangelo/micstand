export interface Emergency {
  type: 'fire' | 'flood' | 'earthquake';
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  timestamp: string;
  reportedBy?: string;
}

export interface EmergencyApiResponse {
  record: {
    emergencies: Emergency[];
  };
  metadata: {
    id: string;
    createdAt: string;
  };
}

export interface EvacuationCenter {
  name: string;
  barangay: string;
  lat: number;
  lng: number;
  capacity: number;
  currentOccupancy: number;
  status: 'available' | 'limited' | 'full';
  facilities: string[];
  contactNumber?: string;
}

export interface WeatherAlert {
  id: string;
  type: 'typhoon' | 'flood' | 'storm' | 'landslide';
  severity: 'warning' | 'alert' | 'advisory';
  title: string;
  description: string;
  affectedAreas: string[];
  issuedAt: string;
  validUntil?: string;
}

export interface GeocodingResponse {
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}
