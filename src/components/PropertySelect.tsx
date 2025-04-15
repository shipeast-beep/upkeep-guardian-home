
import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Home } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const propertyFormSchema = z.object({
  name: z.string().min(1, "Název nemovitosti je povinný"),
  address: z.string().optional(),
  type: z.enum(["house", "apartment", "cottage", "other"]),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const PropertySelect: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { 
    properties, 
    selectedPropertyId, 
    selectProperty, 
    addProperty 
  } = useStore();
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      type: "house",
    },
  });
  
  const onSubmit = (data: PropertyFormValues) => {
    // Make sure name is always provided even if it's empty string
    const propertyData = {
      ...data,
      name: data.name || "Nepojmenovaná nemovitost", // Ensure name is always present
    };
    
    addProperty(propertyData);
    toast.success("Nemovitost byla úspěšně přidána");
    setOpen(false);
    form.reset();
  };
  
  return (
    <div className="flex items-center gap-2 mb-6">
      {properties.length === 0 ? (
        <div className="w-full p-8 border rounded-lg bg-muted/50 flex flex-col items-center justify-center">
          <Home className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">Zatím nemáte žádné nemovitosti</h3>
          <p className="text-muted-foreground text-center mb-4">
            Přidejte svou první nemovitost pro sledování údržby
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Přidat nemovitost
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Přidat novou nemovitost</DialogTitle>
                <DialogDescription>
                  Přidejte detaily o své nemovitosti pro sledování údržby.
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
                    <Button type="submit">Přidat nemovitost</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          <Select
            value={selectedPropertyId || ""}
            onValueChange={selectProperty}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Vyberte nemovitost" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Upraveno: tlačítko přidání zarovnáno na střed */}
          <div className="flex-1 flex justify-center">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Přidat novou nemovitost</DialogTitle>
                  <DialogDescription>
                    Přidejte detaily o své nemovitosti pro sledování údržby.
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
                      <Button type="submit">Přidat nemovitost</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertySelect;

