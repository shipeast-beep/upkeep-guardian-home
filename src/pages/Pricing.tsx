
import React from "react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Download, BarChart4, FileText, ListTodo, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PricingPage: React.FC = () => {
  const { user } = useAuth();

  const features = {
    basic: [
      { icon: <ListTodo className="h-4 w-4" />, text: "Neomezené nemovitosti" },
      { icon: <Bell className="h-4 w-4" />, text: "Notifikace údržby" },
      { icon: <FileText className="h-4 w-4" />, text: "Základní přehled údržby" }
    ],
    premium: [
      { icon: <ListTodo className="h-4 w-4" />, text: "Všechny funkce Basic plánu" },
      { icon: <BarChart4 className="h-4 w-4" />, text: "Pokročilé analýzy a reporty" },
      { icon: <Download className="h-4 w-4" />, text: "Export údržby do PDF" },
      { icon: <Bell className="h-4 w-4" />, text: "Prioritní notifikace" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Zvolte si plán</h1>
        
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Basic Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Basic</CardTitle>
              <CardDescription>Ideální pro začátek s údržbou nemovitostí</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">Zdarma</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 my-4">
                {features.basic.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-green-100">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      {feature.icon}
                      <span>{feature.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/">Používat zdarma</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="border-upkeep-600 flex flex-col">
            <div className="bg-upkeep-600 text-white py-1 px-3 text-center text-sm rounded-t-md">
              Doporučený plán
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Premium</CardTitle>
              <CardDescription>Kompletní funkce pro správu nemovitostí</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">149 Kč</span>
                <span className="text-muted-foreground ml-1">/měsíc</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 my-4">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-green-100">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      {feature.icon}
                      <span>{feature.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="default" className="w-full bg-upkeep-600 hover:bg-upkeep-700">
                Předplatit Premium
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
