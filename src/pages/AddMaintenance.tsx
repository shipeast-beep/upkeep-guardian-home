
import React from "react";
import AppHeader from "@/components/AppHeader";
import PropertySelect from "@/components/PropertySelect";
import AddMaintenanceForm from "@/components/AddMaintenanceForm";
import { useStore } from "@/store/useStore";

const AddMaintenance: React.FC = () => {
  const { properties } = useStore();
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <PropertySelect />
        
        {properties.length > 0 && <AddMaintenanceForm />}
      </main>
    </div>
  );
};

export default AddMaintenance;
