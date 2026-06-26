export interface Route {
  id: string;
  journeyId: string;
  fromLocationId: string;
  toLocationId: string;
  notes: string | null;
  createdAt: Date;
}

export type CreateRouteInput = {
  journeyId: string;
  fromLocationId: string;
  toLocationId: string;
  notes?: string;
};
