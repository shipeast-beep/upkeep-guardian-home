
import { jsPDF } from "jspdf";
import { MaintenanceEvent, Property } from "@/types";
import { format } from "date-fns";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Zajistíme, že se funkce autoTable správně importuje
const addJspdfPlugins = () => {
  const doc = new jsPDF();
  return typeof doc.autoTable === 'function';
};

// Export generatePDF function for use in the ExportPDF component
export const generatePDF = async (
  maintenanceEvents: MaintenanceEvent[],
  propertyName: string,
  includeImages: boolean
) => {
  // Ujistíme se, že je plugin načten
  if (!addJspdfPlugins()) {
    throw new Error("PDF plugin není správně načten. Prosím, obnovte stránku a zkuste to znovu.");
  }

  const doc = new jsPDF();

  // Nadpis dokumentu
  doc.setFontSize(20);
  doc.text("Historie údržby", 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Nemovitost: ${propertyName}`, 105, 22, { align: "center" });
  doc.text(`Vygenerováno: ${format(new Date(), "dd.MM.yyyy")}`, 105, 28, { align: "center" });

  // Tabulka údržby
  const tableData = maintenanceEvents.map(event => [
    format(new Date(event.date), "dd.MM.yyyy"),
    event.title,
    translateCategory(event.category),
    translateRecurringPeriod(event.recurringPeriod),
    event.notes || "",
  ]);

  try {
    doc.autoTable({
      startY: 35,
      head: [["Datum", "Název", "Kategorie", "Periodicita", "Poznámky"]],
      body: tableData,
      margin: { top: 10 },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 70 },
      },
    });
  } catch (error) {
    console.error("Chyba při vytváření tabulky PDF:", error);
    throw new Error("Nepodařilo se vytvořit tabulku v PDF. Zkuste obnovit stránku.");
  }

  // Přidání obrázků, pokud jsou k dispozici a uživatel je chce zahrnout
  if (includeImages) {
    let yPosition = (doc as any).lastAutoTable?.finalY + 15 || 150;
    
    for (const event of maintenanceEvents) {
      // Check if the event has an photo property
      const hasImage = event.photo && typeof event.photo === 'string';
      
      if (hasImage) {
        try {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.text(`Obrázek k údržbě: ${event.title}`, 14, yPosition);
          yPosition += 10;
          
          // Místo pokusu o vložení obrázku jen vytvoříme rámeček
          doc.rect(14, yPosition, 180, 50);
          doc.text("Místo pro obrázek údržby", 105, yPosition + 25, { align: "center" });
          
          yPosition += 60;
        } catch (error) {
          console.error("Chyba při přidávání obrázku:", error);
        }
      }
    }
  }

  // Stažení PDF
  return doc.save(`udrzba_${propertyName.replace(/ /g, "_")}.pdf`);
};

// Pomocné funkce pro překlad kategorií a periodicity

// Přeložení kategorií do češtiny
const translateCategory = (category: string) => {
  const translations: Record<string, string> = {
    electrical: "Elektřina",
    plumbing: "Vodoinstalace",
    gas: "Plyn",
    garden: "Zahrada",
    heating: "Topení",
    air_conditioning: "Klimatizace",
    appliances: "Spotřebiče",
    structural: "Konstrukce",
    other: "Ostatní",
  };
  
  return translations[category] || category;
};

// Přeložení periodicity do češtiny
const translateRecurringPeriod = (period: string) => {
  const translations: Record<string, string> = {
    none: "Nikdy",
    weekly: "Týdně",
    monthly: "Měsíčně",
    quarterly: "Čtvrtletně",
    biannually: "Pololetně",
    annually: "Ročně",
  };
  
  return translations[period] || period;
};

export const generateMaintenancePDF = (
  maintenanceEvents: MaintenanceEvent[],
  properties: Property[]
) => {
  // Ujistíme se, že je plugin načten
  if (!addJspdfPlugins()) {
    throw new Error("PDF plugin není správně načten. Prosím, obnovte stránku a zkuste to znovu.");
  }

  const doc = new jsPDF();

  // Nadpis dokumentu
  doc.setFontSize(20);
  doc.text("Historie údržby", 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Vygenerováno: ${format(new Date(), "dd.MM.yyyy")}`, 105, 22, { align: "center" });

  // Pro každou nemovitost vytvoříme sekci s údržbou
  const propertyMap = new Map<string, Property>();
  properties.forEach(property => propertyMap.set(property.id, property));

  // Seskupit události podle nemovitostí
  const eventsByProperty = maintenanceEvents.reduce((acc, event) => {
    const propertyId = event.propertyId;
    if (!acc[propertyId]) {
      acc[propertyId] = [];
    }
    acc[propertyId].push(event);
    return acc;
  }, {} as Record<string, MaintenanceEvent[]>);

  let yPosition = 30;
  let pageCount = 1;

  try {
    // Pro každou nemovitost vypíšeme údržbu
    Object.entries(eventsByProperty).forEach(([propertyId, events], propertyIndex) => {
      const property = propertyMap.get(propertyId);
      
      if (!property) return;

      // Pokud se další sekce nevejde na stránku, přidáme novou stránku
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
        pageCount++;
      }

      // Nadpis nemovitosti
      doc.setFontSize(16);
      doc.text(`Nemovitost: ${property.name}`, 14, yPosition);
      yPosition += 10;

      if (property.address) {
        doc.setFontSize(12);
        doc.text(`Adresa: ${property.address}`, 14, yPosition);
        yPosition += 10;
      }

      // Tabulka údržby
      const tableData = events.map(event => [
        format(new Date(event.date), "dd.MM.yyyy"),
        event.title,
        translateCategory(event.category),
        translateRecurringPeriod(event.recurringPeriod),
        event.notes || "",
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [["Datum", "Název", "Kategorie", "Periodicita", "Poznámky"]],
        body: tableData,
        margin: { top: 10 },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 70 },
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // Pokud nejsme na poslední nemovitosti, přidáme oddělovač
      if (propertyIndex < Object.keys(eventsByProperty).length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPosition - 5, 196, yPosition - 5);
        yPosition += 10;
      }
    });

    // Přidání číslování stránek
    const totalPages = pageCount;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Strana ${i} z ${totalPages}`, 196, 285, { align: "right" });
    }

    // Vrátíme blob pro stažení
    return doc.output("blob");
  } catch (error) {
    console.error("Chyba při generování PDF:", error);
    throw new Error("Nepodařilo se vytvořit PDF. Zkuste obnovit stránku.");
  }
};
