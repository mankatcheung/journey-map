export interface PublicUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Journey {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  journeyId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  date: string;
  notes: string | null;
  order: number;
  createdAt: string;
}

export interface Route {
  id: string;
  journeyId: string;
  fromLocationId: string;
  toLocationId: string;
  notes: string | null;
  createdAt: string;
}

export interface JourneyWithDetails extends Journey {
  locations: Location[];
  routes: Route[];
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

export interface ApiError {
  error: string;
}
