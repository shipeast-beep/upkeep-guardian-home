
import React from "react";
import { Bell, Home, Menu, Plus, Settings } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const AppHeader: React.FC = () => {
  const isMobile = useIsMobile();
  const notifications = useStore((state) => state.notifications);
  const unreadNotifications = notifications.filter(n => !n.isRead);
  
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/properties" 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                  >
                    <Home className="h-4 w-4" />
                    Properties
                  </Link>
                  <Link 
                    to="/add" 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Maintenance
                  </Link>
                  <Link 
                    to="/history" 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                  >
                    <Home className="h-4 w-4" />
                    Maintenance History
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          ) : null}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-upkeep-600 w-8 h-8 flex items-center justify-center">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-xl hidden md:inline-block">UpKeep Guardian</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {!isMobile && (
            <>
              <Link to="/add">
                <Button variant="outline" size="sm" className="mr-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Maintenance
                </Button>
              </Link>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 px-1 min-w-5 h-5 flex items-center justify-center"
                    variant="destructive"
                  >
                    {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <div className="p-2 text-sm font-medium border-b">
                Notifications
              </div>
              <div className="max-h-[300px] overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map(notification => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start">
                      <Link 
                        to={`/maintenance/${notification.maintenanceEventId}`}
                        className="w-full"
                      >
                        <div className="font-medium">{notification.maintenanceTitle}</div>
                        <div className="text-xs text-muted-foreground">
                          Due: {new Date(notification.date).toLocaleDateString()}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <Link 
                  to="/notifications" 
                  className="block w-full p-2 text-center text-sm text-upkeep-600 hover:underline border-t"
                >
                  View all notifications
                </Link>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
