
import { MaintenanceEvent, Property } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  CalendarClock, 
  Clock,
  Zap,
  Droplet,
  Flame,
  Leaf,
  Thermometer,
  Fan,
  Monitor,
  Building,
  Package
} from "lucide-react";

// Map categories to colors
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

// Map categories to icons
const categoryIcons: Record<string, React.ElementType> = {
  electrical: Zap,
  plumbing: Droplet,
  gas: Flame,
  garden: Leaf,
  heating: Thermometer,
  air_conditioning: Fan,
  appliances: Monitor,
  structural: Building,
  other: Package,
};

// Map categories to Czech translations
const categoryTranslations: Record<string, string> = {
  electrical: "elektřina",
  plumbing: "vodoinstalace",
  gas: "plyn",
  garden: "zahrada",
  heating: "topení",
  air_conditioning: "klimatizace",
  appliances: "spotřebiče",
  structural: "konstrukce",
  other: "ostatní",
};

interface MaintenanceCardProps {
  maintenance: MaintenanceEvent;
  property?: Property;
  showProperty?: boolean;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  maintenance,
  property,
  showProperty = false,
}) => {
  const categoryColor = categoryColors[maintenance.category] || categoryColors.other;
  const CategoryIcon = categoryIcons[maintenance.category] || categoryIcons.other;
  const categoryName = categoryTranslations[maintenance.category] || maintenance.category.replace("_", " ");
  const date = new Date(maintenance.date);
  
  return (
    <Card className="overflow-hidden">
      {maintenance.photo && (
        <div className="h-48 overflow-hidden">
          <img
            src={maintenance.photo}
            alt={maintenance.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{maintenance.title}</CardTitle>
            {showProperty && property && (
              <CardDescription>{property.name}</CardDescription>
            )}
          </div>
          <Badge className={`${categoryColor} flex items-center gap-1`}>
            <CategoryIcon className="h-3 w-3" />
            <span>{categoryName}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
        {maintenance.recurringPeriod !== "none" && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarClock className="mr-2 h-4 w-4" />
            Opakuje se: {translateRecurringPeriod(maintenance.recurringPeriod)}
          </div>
        )}
        {maintenance.notes && (
          <p className="text-sm mt-2 line-clamp-3">{maintenance.notes}</p>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to translate recurring period to Czech
function translateRecurringPeriod(period: string): string {
  const translations: Record<string, string> = {
    weekly: "týdně",
    monthly: "měsíčně",
    quarterly: "čtvrtletně",
    biannually: "pololetně",
    annually: "ročně",
    none: "nikdy"
  };
  return translations[period] || period;
}

export default MaintenanceCard;
