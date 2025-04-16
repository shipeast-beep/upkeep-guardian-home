
import React from "react";
import { MaintenanceEvent } from "@/types";
import { useStore } from "@/store/useStore";
import MaintenanceCard from "./MaintenanceCard";
import { Link } from "react-router-dom";

interface MaintenanceListProps {
  maintenanceEvents: MaintenanceEvent[];
  title?: string;
  emptyMessage?: string;
  limit?: number;
  showProperties?: boolean;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({
  maintenanceEvents,
  title = "Historie údržby",
  emptyMessage = "Žádné záznamy údržby k zobrazení.",
  limit,
  showProperties = false,
}) => {
  const properties = useStore((state) => state.properties);
  
  const displayEvents = limit 
    ? maintenanceEvents.slice(0, limit) 
    : maintenanceEvents;
  
  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          {limit && maintenanceEvents.length > limit && (
            <Link 
              to="/history" 
              className="text-sm text-upkeep-600 hover:underline"
            >
              Zobrazit vše
            </Link>
          )}
        </div>
      )}
      
      {displayEvents.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event) => (
            <Link key={event.id} to={`/maintenance/${event.id}`}>
              <MaintenanceCard 
                maintenance={event} 
                property={showProperties ? properties.find(p => p.id === event.propertyId) : undefined}
                showProperty={showProperties}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceList;
