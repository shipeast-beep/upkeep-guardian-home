
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
  name: z.string().min(1, "Název nemovitosti je povinný"),
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
      name: data.name || "Nepojmenovaná nemovitost", // Ensure name is always present
    };
    
    if (editingPropertyId) {
      updateProperty(editingPropertyId, propertyData);
      toast.success("Nemovitost byla úspěšně aktualizována");
    } else {
      addProperty(propertyData);
      toast.success("Nemovitost byla úspěšně přidána");
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
            <h1 className="text-2xl font-bold">Moje nemovitosti</h1>
          </div>
          {/* Tlačítko Add Property bylo odstraněno */}
        </div>
        
        {properties.length === 0 ? (
          <div className="p-12 text-center border rounded-lg bg-muted/50">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Zatím nemáte žádné nemovitosti</p>
            <Button onClick={openAddDialog} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Přidejte svou první nemovitost
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map(property => (
              <Card key={property.id} className="overflow-hidden">
                <CardHeader className="bg-upkeep-50 p-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                    <Badge>{property.type === "house" ? "Dům" : 
                           property.type === "apartment" ? "Byt" : 
                           property.type === "cottage" ? "Chata" : "Jiné"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {property.address && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {property.address}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">{getMaintenanceCount(property.id)}</span> záznamů údržby
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      selectProperty(property.id);
                      toast.success(`Přepnuto na ${property.name}`);
                    }}
                  >
                    Vybrat
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
                          <AlertDialogTitle>Smazat nemovitost</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tímto trvale smažete tuto nemovitost a všech {getMaintenanceCount(property.id)} záznamů údržby. 
                            Tuto akci nelze vrátit zpět.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Zrušit</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => {
                              deleteProperty(property.id);
                              toast.success("Nemovitost byla úspěšně smazána");
                            }}
                          >
                            Smazat
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
              {editingPropertyId ? "Upravit nemovitost" : "Přidat novou nemovitost"}
            </DialogTitle>
            <DialogDescription>
              {editingPropertyId 
                ? "Aktualizujte informace o své nemovitosti" 
                : "Přidejte detaily o své nemovitosti pro sledování údržby"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Název nemovitosti</FormLabel>
                    <FormControl>
                      <Input placeholder="Můj dům" {...field} />
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
                    <FormLabel>Adresa (Volitelné)</FormLabel>
                    <FormControl>
                      <Input placeholder="Hlavní 123" {...field} />
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
                    <FormLabel>Typ nemovitosti</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte typ nemovitosti" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="house">Dům</SelectItem>
                        <SelectItem value="apartment">Byt</SelectItem>
                        <SelectItem value="cottage">Chata</SelectItem>
                        <SelectItem value="other">Jiné</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="w-full">
                  {editingPropertyId ? "Uložit změny" : "Přidat nemovitost"}
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

