
import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ImagePlus } from "lucide-react";
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

const CATEGORIES: { value: Category; label: string }[] = [
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

const RECURRING_PERIODS: { value: RecurringPeriod; label: string }[] = [
  { value: "none", label: "No Reminder" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Every 3 Months" },
  { value: "biannually", label: "Every 6 Months" },
  { value: "annually", label: "Yearly" },
];

const maintenanceFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.enum(["electrical", "plumbing", "gas", "garden", "heating", 
                  "air_conditioning", "appliances", "structural", "other"] as const),
  date: z.date({ required_error: "Date is required" }),
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
      toast.error("Please select a property first");
      return;
    }
    
    addMaintenanceEvent({
      ...data,
      propertyId: selectedPropertyId,
      photo: photoPreview || undefined,
    });
    
    toast.success("Maintenance event added successfully");
    navigate("/");
  };
  
  if (properties.length === 0) {
    return null; // PropertySelect component will handle the empty state
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add Maintenance Event</h2>
        <p className="text-muted-foreground">
          Record a new maintenance task for your property
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Filter replacement" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a descriptive title for this maintenance event
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
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the category that best describes this maintenance
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
                <FormLabel>Date</FormLabel>
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
                          <span>Pick a date</span>
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
                  When was this maintenance performed?
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
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional details about this maintenance event"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Photo</FormLabel>
            <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer bg-muted/50" onClick={() => document.getElementById("photo-upload")?.click()}>
              {photoPreview ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={photoPreview}
                    alt="Preview"
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
                    Change
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImagePlus className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload a photo (receipt, before/after)
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
                <FormLabel>Recurring Reminder</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reminder frequency" />
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
                  Set a recurring reminder for this maintenance task
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full md:w-auto">
            Save Maintenance Event
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddMaintenanceForm;
