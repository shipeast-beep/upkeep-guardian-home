
import React from "react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Download, BarChart4, FileText, ListTodo, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const { setSubscriptionStatus } = useStore();

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

  const handleSubscribe = (type: "monthly" | "yearly") => {
    // Simulate subscription process
    toast.success(`Předplatné ${type === "monthly" ? "měsíční" : "roční"} bylo úspěšně aktivováno`);
    
    // Update subscription status in store
    setSubscriptionStatus({
      isSubscribed: true,
      subscriptionType: type === "monthly" ? "monthly" : "yearly",
      expiryDate: new Date(Date.now() + (type === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">Zvolte si plán</h1>
        
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
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
                    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
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
          <Card className="border-upkeep-600 flex flex-col relative">
            <div className="bg-upkeep-600 text-white py-1 px-3 text-center text-sm rounded-t-md">
              Doporučený plán
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Premium</CardTitle>
              <CardDescription>Kompletní funkce pro správu nemovitostí</CardDescription>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">27 Kč</span>
                  <span className="text-muted-foreground">/měsíčně</span>
                </div>
                <div className="text-sm text-muted-foreground">nebo</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">297 Kč</span>
                  <span className="text-muted-foreground">/ročně</span>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">Ušetříte 27 Kč</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 my-4">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      {feature.icon}
                      <span>{feature.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                variant="default" 
                className="w-full bg-upkeep-600 hover:bg-upkeep-700"
                onClick={() => handleSubscribe("monthly")}
              >
                Měsíční předplatné
              </Button>
              <Button 
                variant="default" 
                className="w-full border border-upkeep-600 bg-background hover:bg-upkeep-50 text-upkeep-700 dark:bg-upkeep-900 dark:hover:bg-upkeep-800 dark:text-upkeep-100"
                onClick={() => handleSubscribe("yearly")}
              >
                Roční předplatné (2 měsíce zdarma)
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-10 max-w-3xl mx-auto text-center">
          <h2 className="text-lg font-semibold mb-4">O aplikaci Udrž to!</h2>
          <div className="bg-muted/30 p-6 rounded-lg">
            <p className="mb-4">Udrž to! je moderní aplikace pro správu údržby nemovitostí. Pomáhá vlastníkům a správcům nemovitostí sledovat a plánovat pravidelnou údržbu pro zajištění dlouhé životnosti a bezproblémového provozu.</p>
            <p>Aplikace vám pomůže zaznamenat, co jste kdy opravovali, investice do nemovitostí, a připomene vám plánovanou údržbu včas.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
