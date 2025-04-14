
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import AppHeader from "@/components/AppHeader";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Calendar, 
  Home, 
  Pencil, 
  Tag, 
  Trash2,
  CalendarClock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Map categories to colors (same as in MaintenanceCard)
const categoryColors: Record<string, string> = {
  electrical: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  plumbing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  gas: "bg-red-100 text-red-800 hover:bg-red-200",
  garden: "bg-green-100 text-green-800 hover:bg-green-200",
  heating: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  air_conditioning: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  appliances: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  structural: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  other: "bg-slate-100 text-slate-800 hover:bg-slate-200",
};

const MaintenanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { maintenanceEvents, properties, deleteMaintenanceEvent } = useStore();
  
  const event = maintenanceEvents.find(event => event.id === id);
  const property = event ? properties.find(p => p.id === event.propertyId) : null;
  
  if (!event || !property) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Maintenance Event Not Found</h1>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const categoryColor = categoryColors[event.category] || categoryColors.other;
  const handleDelete = () => {
    deleteMaintenanceEvent(event.id);
    toast.success("Maintenance event deleted successfully");
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {event.photo && (
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={event.photo}
                  alt={event.title}
                  className="w-full object-cover"
                />
              </div>
            </div>
          )}
          
          <div className={`${event.photo ? 'md:w-2/3' : 'w-full'} space-y-6`}>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <Badge className={categoryColor}>
                {event.category.replace("_", " ")}
              </Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center">
                <Home className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>{property.name}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>{format(new Date(event.date), "PPP")}</span>
              </div>
              
              {event.recurringPeriod !== "none" && (
                <div className="flex items-center">
                  <CalendarClock className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>
                    Repeats: {event.recurringPeriod}
                    {event.nextDueDate && (
                      <> (Next: {format(new Date(event.nextDueDate), "PPP")})</>
                    )}
                  </span>
                </div>
              )}
            </div>
            
            {event.notes && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h2 className="font-semibold mb-2">Notes</h2>
                <p className="whitespace-pre-line">{event.notes}</p>
              </div>
            )}
            
            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={() => navigate(`/edit/${event.id}`)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this maintenance event and remove any associated reminders.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MaintenanceDetail;
