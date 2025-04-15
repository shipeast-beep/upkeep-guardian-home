
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
  { value: "all", label: "Všechny kategorie" },
  { value: "electrical", label: "Elektřina" },
  { value: "plumbing", label: "Vodoinstalace" },
  { value: "gas", label: "Plyn" },
  { value: "garden", label: "Zahrada" },
  { value: "heating", label: "Topení" },
  { value: "air_conditioning", label: "Klimatizace" },
  { value: "appliances", label: "Spotřebiče" },
  { value: "structural", label: "Konstrukce" },
  { value: "other", label: "Ostatní" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Nejnovější" },
  { value: "oldest", label: "Nejstarší" },
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
            <h1 className="text-2xl font-bold">Historie údržby</h1>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Vyhledat údržbu"
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
                <SelectValue placeholder="Filtrovat podle kategorie" />
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
                <SelectValue placeholder="Seřadit podle" />
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
          title={`${filteredEvents.length} záznamů údržby`}
          emptyMessage="Žádné záznamy o údržbě nenalezeny"
          showProperties={!selectedPropertyId}
        />
      </main>
    </div>
  );
};

export default MaintenanceHistory;
