
import React from "react";
import { useStore } from "@/store/useStore";
import AppHeader from "@/components/AppHeader";
import PropertySelect from "@/components/PropertySelect";
import MaintenanceList from "@/components/MaintenanceList";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, ArrowDown } from "lucide-react";

const Index: React.FC = () => {
  const { 
    properties, 
    maintenanceEvents, 
    selectedPropertyId,
  } = useStore();

  // Filter events for the selected property
  const filteredEvents = selectedPropertyId
    ? maintenanceEvents.filter(event => event.propertyId === selectedPropertyId)
    : maintenanceEvents;
  
  // Get upcoming events (with future due dates)
  const now = new Date();
  const upcomingEvents = filteredEvents
    .filter(event => event.nextDueDate && new Date(event.nextDueDate) > now)
    .sort((a, b) => 
      new Date(a.nextDueDate as Date).getTime() - new Date(b.nextDueDate as Date).getTime()
    );
  
  // Get recent events (most recent first)
  const recentEvents = [...filteredEvents]
    .sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <PropertySelect />
        
        {properties.length > 0 ? (
          <>
            {!selectedPropertyId && properties.length > 0 && (
              <div className="mb-6 flex items-center justify-center">
                <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                  <span>Select a property to filter maintenance events</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-center mb-6">
              <Link to="/add">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Maintenance Event
                </Button>
              </Link>
            </div>
            
            <div className="space-y-8">
              <MaintenanceList 
                maintenanceEvents={upcomingEvents}
                title="Upcoming Maintenance"
                emptyMessage="No upcoming maintenance tasks"
                limit={3}
              />
              
              <MaintenanceList 
                maintenanceEvents={recentEvents}
                title="Recent Maintenance"
                emptyMessage="No maintenance history yet"
                limit={6}
              />
            </div>
          </>
        ) : (
          <div className="text-center my-12">
            <div className="inline-block p-3 rounded-full bg-upkeep-100 text-upkeep-600 mb-4">
              <Wrench className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to UpKeep Guardian</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your personal property maintenance tracker. Start by adding your first property.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
