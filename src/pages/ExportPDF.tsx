
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import { FilePdf, Download, AlertCircle } from "lucide-react";
import { generateMaintenancePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

const ExportPDF: React.FC = () => {
  const { maintenanceEvents, properties } = useStore();
  const { toast } = useToast();
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePropertyToggle = (propertyId: string) => {
    setSelectedPropertyIds(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPropertyIds.length === properties.length) {
      setSelectedPropertyIds([]);
    } else {
      setSelectedPropertyIds(properties.map(p => p.id));
    }
  };

  const handleExport = async () => {
    if (selectedPropertyIds.length === 0) {
      toast({
        title: "Žádné nemovitosti nevybrány",
        description: "Vyberte alespoň jednu nemovitost pro export.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Filtrovat údržbu podle vybraných nemovitostí
      const filteredEvents = maintenanceEvents.filter(
        event => selectedPropertyIds.includes(event.propertyId)
      );

      // Filtrovat nemovitosti podle výběru
      const filteredProperties = properties.filter(
        property => selectedPropertyIds.includes(property.id)
      );

      // Generovat PDF
      const pdfBlob = await generateMaintenancePDF(filteredEvents, filteredProperties);
      
      // Vytvořit objekt URL pro stažení
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      // Vytvořit dočasný odkaz a simulovat kliknutí pro stažení
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `udrzba_nemovitosti_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Čistění
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      toast({
        title: "PDF bylo úspěšně vytvořeno",
        description: "Soubor se stahuje do vašeho zařízení."
      });
    } catch (error) {
      console.error("Chyba při generování PDF:", error);
      toast({
        title: "Chyba při generování PDF",
        description: "Prosím zkuste to znovu později.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Export údržby do PDF</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilePdf className="h-5 w-5" />
              Generovat PDF report údržby
            </CardTitle>
            <CardDescription>
              Vyberte nemovitosti, které chcete zahrnout do PDF reportu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {properties.length > 0 ? (
              <>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="select-all" 
                    checked={selectedPropertyIds.length === properties.length && properties.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all">Vybrat všechny nemovitosti</Label>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {properties.map((property) => (
                    <div 
                      key={property.id}
                      className="flex items-center space-x-2 border rounded-md p-3"
                    >
                      <Checkbox 
                        id={`property-${property.id}`}
                        checked={selectedPropertyIds.includes(property.id)}
                        onCheckedChange={() => handlePropertyToggle(property.id)}
                      />
                      <Label htmlFor={`property-${property.id}`} className="flex-grow cursor-pointer">
                        {property.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="mb-2 font-medium">Žádné nemovitosti</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nejsou k dispozici žádné nemovitosti pro generování PDF.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" disabled={isGenerating}>
              Zrušit
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={selectedPropertyIds.length === 0 || isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGenerating ? "Generuji PDF..." : "Exportovat do PDF"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>O exportu do PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Funkce exportu do PDF vám umožňuje vytvořit přehledný dokument s historií údržby vašich nemovitostí. 
              Tento dokument je užitečný pro:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Archivaci historie údržby</li>
              <li>Sdílení s rodinnými příslušníky nebo spolumajiteli</li>
              <li>Doložení pravidelné údržby při prodeji nemovitosti</li>
              <li>Přehled pro pojišťovnu nebo správce nemovitosti</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Export do PDF je dostupný pouze pro uživatele s Premium plánem.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ExportPDF;
