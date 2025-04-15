
import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { useStore } from "@/store/useStore";
import { Building2, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const propertyFormSchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().optional(),
  type: z.enum(["house", "apartment", "cottage", "other"]),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const Properties: React.FC = () => {
  const { 
    properties, 
    maintenanceEvents, 
    addProperty, 
    updateProperty, 
    deleteProperty,
    selectProperty 
  } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      type: "house",
    },
  });
  
  const onSubmit = (data: PropertyFormValues) => {
    // Ensure name is always provided
    const propertyData = {
      ...data,
      name: data.name || "Unnamed Property", // Ensure name is always present
    };
    
    if (editingPropertyId) {
      updateProperty(editingPropertyId, propertyData);
      toast.success("Property updated successfully");
    } else {
      addProperty(propertyData);
      toast.success("Property added successfully");
    }
    setDialogOpen(false);
    setEditingPropertyId(null);
    form.reset();
  };
  
  const openEditDialog = (property: {id: string, name: string, address?: string, type?: string}) => {
    form.reset({
      name: property.name,
      address: property.address || "",
      type: (property.type as any) || "house",
    });
    setEditingPropertyId(property.id);
    setDialogOpen(true);
  };
  
  const openAddDialog = () => {
    form.reset({
      name: "",
      address: "",
      type: "house",
    });
    setEditingPropertyId(null);
    setDialogOpen(true);
  };
  
  // Count maintenance events for each property
  const getMaintenanceCount = (propertyId: string) => {
    return maintenanceEvents.filter(event => event.propertyId === propertyId).length;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold">My Properties</h1>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
        
        {properties.length === 0 ? (
          <div className="p-12 text-center border rounded-lg bg-muted/50">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No properties yet</p>
            <Button onClick={openAddDialog} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map(property => (
              <Card key={property.id} className="overflow-hidden">
                <CardHeader className="bg-upkeep-50 p-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                    <Badge>{property.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {property.address && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {property.address}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">{getMaintenanceCount(property.id)}</span> maintenance events
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      selectProperty(property.id);
                      toast.success(`Switched to ${property.name}`);
                    }}
                  >
                    Select
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(property)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete property</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this property and all its {getMaintenanceCount(property.id)} maintenance events. 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => {
                              deleteProperty(property.id);
                              toast.success("Property deleted successfully");
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPropertyId ? "Edit Property" : "Add New Property"}
            </DialogTitle>
            <DialogDescription>
              {editingPropertyId 
                ? "Update details about your property" 
                : "Add details about your property to track maintenance events"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Home" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="cottage">Cottage</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {editingPropertyId ? "Save Changes" : "Add Property"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Properties;
