
import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  ImagePlus,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Category, RecurringPeriod } from "../types";

const CATEGORIES: { value: Category; label: string; icon: React.ElementType }[] = [
  { value: "electrical", label: "Elektřina", icon: Zap },
  { value: "plumbing", label: "Vodoinstalace", icon: Droplet },
  { value: "gas", label: "Plyn", icon: Flame },
  { value: "garden", label: "Zahrada", icon: Leaf },
  { value: "heating", label: "Topení", icon: Thermometer },
  { value: "air_conditioning", label: "Klimatizace", icon: Fan },
  { value: "appliances", label: "Spotřebiče", icon: Monitor },
  { value: "structural", label: "Konstrukce", icon: Building },
  { value: "other", label: "Ostatní", icon: Package },
];

const RECURRING_PERIODS: { value: RecurringPeriod; label: string }[] = [
  { value: "none", label: "Bez připomenutí" },
  { value: "weekly", label: "Týdně" },
  { value: "monthly", label: "Měsíčně" },
  { value: "quarterly", label: "Čtvrtletně" },
  { value: "biannually", label: "Pololetně" },
  { value: "annually", label: "Ročně" },
];

const maintenanceFormSchema = z.object({
  title: z.string().min(1, { message: "Název je povinný" }),
  category: z.enum(["electrical", "plumbing", "gas", "garden", "heating", 
                  "air_conditioning", "appliances", "structural", "other"] as const),
  date: z.date({ required_error: "Datum je povinné" }),
  notes: z.string().optional(),
  recurringPeriod: z.enum(["none", "weekly", "monthly", "quarterly", "biannually", "annually"] as const),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

const AddMaintenanceForm: React.FC = () => {
  const { properties, selectedPropertyId, addMaintenanceEvent } = useStore();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Default form values
  const defaultValues: Partial<MaintenanceFormValues> = {
    title: "",
    category: "other",
    date: new Date(),
    notes: "",
    recurringPeriod: "none",
  };
  
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues,
  });
  
  // Handle file selection for photo
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data: MaintenanceFormValues) => {
    if (!selectedPropertyId) {
      toast.error("Vyberte nejprve nemovitost");
      return;
    }
    
    addMaintenanceEvent({
      ...data,
      propertyId: selectedPropertyId,
      photo: photoPreview || undefined,
      title: data.title,
      date: data.date,
      category: data.category,
      recurringPeriod: data.recurringPeriod
    });
    
    toast.success("Událost údržby byla úspěšně přidána");
    navigate("/");
  };
  
  if (properties.length === 0) {
    return null; // PropertySelect component will handle the empty state
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Přidat událost údržby</h2>
        <p className="text-muted-foreground">
          Zaznamenejte nový úkol údržby pro vaši nemovitost
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Název</FormLabel>
                <FormControl>
                  <Input placeholder="Výměna filtru" {...field} />
                </FormControl>
                <FormDescription>
                  Zadejte popisný název pro tuto událost údržby
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte kategorii" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      return (
                        <SelectItem key={category.value} value={category.value} className="flex items-center">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Vyberte kategorii, která nejlépe popisuje tuto údržbu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Datum</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Vyberte datum</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Kdy byla tato údržba provedena?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poznámky</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jakékoliv další podrobnosti o této události údržby"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Fotografie</FormLabel>
            <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer bg-muted/50" onClick={() => document.getElementById("photo-upload")?.click()}>
              {photoPreview ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={photoPreview}
                    alt="Náhled"
                    className="rounded-md max-h-64 mx-auto"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoPreview(null);
                    }}
                  >
                    Změnit
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImagePlus className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Klikněte pro nahrání fotografie (účtenka, před/po)
                  </p>
                </div>
              )}
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="recurringPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opakující se připomenutí</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte frekvenci připomenutí" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RECURRING_PERIODS.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Nastavte opakující se připomenutí pro tento úkol údržby
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full md:w-auto">
            Uložit událost údržby
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddMaintenanceForm;
