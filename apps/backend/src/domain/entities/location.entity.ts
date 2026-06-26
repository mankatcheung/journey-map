export interface Location {
  id: string;
  journeyId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  date: Date;
  notes: string | null;
  order: number;
  createdAt: Date;
}

export type CreateLocationInput = {
  journeyId: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  date: Date;
  notes?: string;
};

export type UpdateLocationInput = {
  name?: string;
  latitude?: number;
  longitude?: number;
  address?: string | null;
  date?: Date;
  notes?: string | null;
  order?: number;
};
