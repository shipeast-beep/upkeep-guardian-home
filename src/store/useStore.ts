
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MaintenanceEvent, Property, Notification, Category, RecurringPeriod } from "../types";
import { addMonths, addWeeks, addYears, format } from "date-fns";

interface State {
  properties: Property[];
  maintenanceEvents: MaintenanceEvent[];
  notifications: Notification[];
  selectedPropertyId: string | null;
  
  // Property actions
  addProperty: (property: Omit<Property, "id">) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  selectProperty: (id: string | null) => void;
  
  // Maintenance actions
  addMaintenanceEvent: (event: Omit<MaintenanceEvent, "id">) => void;
  updateMaintenanceEvent: (id: string, event: Partial<MaintenanceEvent>) => void;
  deleteMaintenanceEvent: (id: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, "id">) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

// Helper function to calculate next due date based on recurring period
const calculateNextDueDate = (date: Date, recurringPeriod: RecurringPeriod): Date | undefined => {
  if (recurringPeriod === "none") return undefined;
  
  const currentDate = new Date(date);
  
  switch (recurringPeriod) {
    case "weekly":
      return addWeeks(currentDate, 1);
    case "monthly":
      return addMonths(currentDate, 1);
    case "quarterly":
      return addMonths(currentDate, 3);
    case "biannually":
      return addMonths(currentDate, 6);
    case "annually":
      return addYears(currentDate, 1);
    default:
      return undefined;
  }
};

// Create store with persistence
export const useStore = create<State>()(
  persist(
    (set) => ({
      properties: [],
      maintenanceEvents: [],
      notifications: [],
      selectedPropertyId: null,
      
      // Property actions
      addProperty: (property) => set((state) => ({
        properties: [...state.properties, { ...property, id: crypto.randomUUID() }]
      })),
      
      updateProperty: (id, property) => set((state) => ({
        properties: state.properties.map(p => 
          p.id === id ? { ...p, ...property } : p
        )
      })),
      
      deleteProperty: (id) => set((state) => ({
        properties: state.properties.filter(p => p.id !== id),
        // Also remove associated maintenance events and notifications
        maintenanceEvents: state.maintenanceEvents.filter(e => e.propertyId !== id),
        notifications: state.notifications.filter(n => n.propertyId !== id),
        // Reset selected property if it was the deleted one
        selectedPropertyId: state.selectedPropertyId === id ? null : state.selectedPropertyId
      })),
      
      selectProperty: (id) => set({ selectedPropertyId: id }),
      
      // Maintenance actions
      addMaintenanceEvent: (event) => {
        const newEvent = { 
          ...event, 
          id: crypto.randomUUID(),
          nextDueDate: calculateNextDueDate(event.date, event.recurringPeriod) 
        };
        
        set((state) => ({
          maintenanceEvents: [...state.maintenanceEvents, newEvent],
        }));
        
        // If event has a recurring period, add a notification for the next due date
        if (newEvent.nextDueDate && newEvent.recurringPeriod !== "none") {
          set((state) => ({
            notifications: [...state.notifications, {
              id: crypto.randomUUID(),
              maintenanceEventId: newEvent.id,
              propertyId: newEvent.propertyId,
              maintenanceTitle: newEvent.title,
              date: newEvent.nextDueDate as Date,
              isRead: false
            }]
          }));
        }
      },
      
      updateMaintenanceEvent: (id, eventUpdate) => set((state) => {
        const updatedEvents = state.maintenanceEvents.map(event => {
          if (event.id !== id) return event;
          
          const updatedEvent = { ...event, ...eventUpdate };
          
          // Recalculate next due date if date or recurringPeriod changed
          if (eventUpdate.date || eventUpdate.recurringPeriod) {
            updatedEvent.nextDueDate = calculateNextDueDate(
              eventUpdate.date || event.date,
              eventUpdate.recurringPeriod || event.recurringPeriod
            );
          }
          
          return updatedEvent;
        });
        
        // Update related notifications
        let updatedNotifications = [...state.notifications];
        const event = updatedEvents.find(e => e.id === id);
        
        if (event) {
          // Remove old notifications for this event
          updatedNotifications = updatedNotifications.filter(
            n => n.maintenanceEventId !== id
          );
          
          // Add new notification if needed
          if (event.nextDueDate && event.recurringPeriod !== "none") {
            updatedNotifications.push({
              id: crypto.randomUUID(),
              maintenanceEventId: event.id,
              propertyId: event.propertyId,
              maintenanceTitle: event.title,
              date: event.nextDueDate,
              isRead: false
            });
          }
        }
        
        return {
          maintenanceEvents: updatedEvents,
          notifications: updatedNotifications
        };
      }),
      
      deleteMaintenanceEvent: (id) => set((state) => ({
        maintenanceEvents: state.maintenanceEvents.filter(e => e.id !== id),
        notifications: state.notifications.filter(n => n.maintenanceEventId !== id)
      })),
      
      // Notification actions
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: crypto.randomUUID() }]
      })),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        )
      })),
      
      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }))
    }),
    {
      name: "upkeep-guardian-storage",
      partialize: (state) => ({
        properties: state.properties,
        maintenanceEvents: state.maintenanceEvents,
        notifications: state.notifications,
        selectedPropertyId: state.selectedPropertyId
      })
    }
  )
);
