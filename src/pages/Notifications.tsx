
import React from "react";
import AppHeader from "@/components/AppHeader";
import { useStore } from "@/store/useStore";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Notifications: React.FC = () => {
  const { notifications, properties, markNotificationAsRead } = useStore();
  
  // Sort notifications by date (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Oznámení</h1>
        
        {sortedNotifications.length === 0 ? (
          <div className="p-12 text-center border rounded-lg bg-muted/50">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Zatím žádná oznámení</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedNotifications.map(notification => {
              const property = properties.find(p => p.id === notification.propertyId);
              return (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "transition-all",
                    !notification.isRead && "border-l-4 border-l-upkeep-600"
                  )}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {notification.maintenanceTitle}
                        </h3>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-upkeep-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {property?.name} - Termín: {format(new Date(notification.date), "PPP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Označit jako přečtené
                        </Button>
                      )}
                      <Link to={`/maintenance/${notification.maintenanceEventId}`}>
                        <Button size="sm">Zobrazit</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
