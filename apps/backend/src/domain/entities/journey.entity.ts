export interface Journey {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateJourneyInput = {
  userId: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
};

export type UpdateJourneyInput = {
  name?: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
};
