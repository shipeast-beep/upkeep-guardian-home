
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import PropertySelect from "@/components/PropertySelect";
import MaintenanceList from "@/components/MaintenanceList";
import { useStore } from "@/store/useStore";
import { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Search, ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "gas", label: "Gas" },
  { value: "garden", label: "Garden" },
  { value: "heating", label: "Heating" },
  { value: "air_conditioning", label: "Air Conditioning" },
  { value: "appliances", label: "Appliances" },
  { value: "structural", label: "Structural" },
  { value: "other", label: "Other" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const MaintenanceHistory: React.FC = () => {
  const { maintenanceEvents, selectedPropertyId } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  // Filter events by selected property
  let filteredEvents = selectedPropertyId
    ? maintenanceEvents.filter(event => event.propertyId === selectedPropertyId)
    : maintenanceEvents;
  
  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredEvents = filteredEvents.filter(event => 
      event.title.toLowerCase().includes(term) ||
      (event.notes && event.notes.toLowerCase().includes(term))
    );
  }
  
  // Filter by category
  if (categoryFilter !== "all") {
    filteredEvents = filteredEvents.filter(event => event.category === categoryFilter);
  }
  
  // Sort events
  filteredEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <PropertySelect />
        
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Maintenance History</h1>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search maintenance events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value as Category | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <MaintenanceList 
          maintenanceEvents={filteredEvents}
          title={`${filteredEvents.length} Maintenance Events`}
          emptyMessage="No maintenance events found"
          showProperties={!selectedPropertyId}
        />
      </main>
    </div>
  );
};

export default MaintenanceHistory;
