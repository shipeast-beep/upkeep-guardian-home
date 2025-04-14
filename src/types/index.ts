
export type Category = 
  | "electrical"
  | "plumbing"
  | "gas"
  | "garden"
  | "heating"
  | "air_conditioning"
  | "appliances"
  | "structural"
  | "other";

export type RecurringPeriod = 
  | "none"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "biannually"
  | "annually";

export interface Property {
  id: string;
  name: string;
  address?: string;
  type?: 'house' | 'apartment' | 'cottage' | 'other';
}

export interface MaintenanceEvent {
  id: string;
  propertyId: string;
  title: string;
  category: Category;
  date: Date;
  notes?: string;
  photo?: string;
  recurringPeriod: RecurringPeriod;
  nextDueDate?: Date;
}

export interface Notification {
  id: string;
  maintenanceEventId: string;
  propertyId: string;
  maintenanceTitle: string;
  date: Date;
  isRead: boolean;
}
