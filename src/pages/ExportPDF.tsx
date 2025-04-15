import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { MaintenanceList } from "@/components/MaintenanceList";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileDown } from "lucide-react"; // Opraveno: použit správný FileDown místo FilePdf
import { generatePDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";

const ExportPDF: React.FC = () => {
  const maintenanceEvents = useStore((state) => state.maintenanceEvents);
  const properties = useStore((state) => state.properties);
  const selectedPropertyId = useStore((state) => state.selectedPropertyId);
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const [includeImages, setIncludeImages] = useState(true);
  
  const filteredEvents = selectedPropertyId
    ? maintenanceEvents.filter(event => event.propertyId === selectedPropertyId)
    : maintenanceEvents;

  const handleGeneratePdf = async () => {
    if (filteredEvents.length === 0) {
      toast.error("Žádné záznamy údržby k exportu.");
      return;
    }

    const propertyName = selectedProperty ? selectedProperty.name : 'Všechny nemovitosti';
    
    try {
      await generatePDF(filteredEvents, propertyName, includeImages);
      toast.success("PDF vygenerováno úspěšně!");
    } catch (error: any) {
      console.error("Chyba při generování PDF:", error);
      toast.error("Chyba při generování PDF: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Export do PDF</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nastavení exportu</CardTitle>
            <CardDescription>Vyberte možnosti pro export údržby do PDF.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="includeImages">Zahrnout obrázky</Label>
              <Switch
                id="includeImages"
                checked={includeImages}
                onCheckedChange={(checked) => setIncludeImages(checked)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGeneratePdf}>
              <FileDown className="h-4 w-4 mr-2" />
              Generovat PDF
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Náhled údržby</h2>
          {filteredEvents.length === 0 ? (
            <p className="text-muted-foreground">Žádné záznamy údržby k zobrazení.</p>
          ) : (
            <MaintenanceList maintenanceEvents={filteredEvents} />
          )}
        </div>
      </main>
    </div>
  );
};

export default ExportPDF;
