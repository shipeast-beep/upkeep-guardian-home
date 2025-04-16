
import React from "react";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User, Languages, Moon, Sun, CreditCard, LogOut, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("profile");
  
  const { 
    isDarkMode, 
    toggleDarkMode, 
    language, 
    setLanguage, 
    subscriptionStatus,
    setSubscriptionStatus
  } = useStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Synchronize mobile and desktop tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Effect to apply dark mode
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 lg:w-1/5">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{language === "cs" ? "Nastavení" : "Settings"}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs 
                  value={activeTab} 
                  onValueChange={handleTabChange} 
                  orientation="vertical" 
                  className="w-full"
                >
                  <TabsList className="w-full flex flex-col items-stretch h-auto">
                    <TabsTrigger value="profile" className="justify-start">
                      <User className="w-4 h-4 mr-2" />
                      {language === "cs" ? "Profil" : "Profile"}
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      {language === "cs" ? "Oznámení" : "Notifications"}
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="justify-start">
                      {isDarkMode ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                      {language === "cs" ? "Vzhled" : "Appearance"}
                    </TabsTrigger>
                    <TabsTrigger value="subscription" className="justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {language === "cs" ? "Předplatné" : "Subscription"}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-3/4 lg:w-4/5">
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange} 
              className="w-full"
            >
              <TabsContent value="profile" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "cs" ? "Profil" : "Profile"}</CardTitle>
                    <CardDescription>
                      {language === "cs" 
                        ? "Spravujte své uživatelské údaje a nastavení účtu."
                        : "Manage your user data and account settings."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{language === "cs" ? "Jméno" : "Name"}</Label>
                      <Input id="name" placeholder={language === "cs" ? "Jméno" : "Name"} defaultValue={user?.email?.split('@')[0] || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" disabled value={user?.email || ""} />
                    </div>
                    <div className="pt-4 flex items-center justify-between">
                      <Button variant="outline" onClick={handleSignOut} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        {language === "cs" ? "Odhlásit se" : "Sign Out"}
                      </Button>
                      <Button>{language === "cs" ? "Uložit změny" : "Save Changes"}</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "cs" ? "Oznámení" : "Notifications"}</CardTitle>
                    <CardDescription>
                      {language === "cs"
                        ? "Nastavte si způsoby a četnost oznámení o údržbě."
                        : "Configure your maintenance notification preferences."
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{language === "cs" ? "Email oznámení" : "Email notifications"}</Label>
                        <p className="text-sm text-muted-foreground">
                          {language === "cs" ? "Dostávejte oznámení na email" : "Receive notifications via email"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>
                          {language === "cs" ? "Připomenutí týden předem" : "One week reminder"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {language === "cs" 
                            ? "Dostávejte připomenutí týden před plánovanou údržbou" 
                            : "Get reminded one week before scheduled maintenance"
                          }
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>
                          {language === "cs" ? "Připomenutí den předem" : "One day reminder"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {language === "cs" 
                            ? "Dostávejte připomenutí den před plánovanou údržbou" 
                            : "Get reminded one day before scheduled maintenance"
                          }
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "cs" ? "Vzhled" : "Appearance"}</CardTitle>
                    <CardDescription>
                      {language === "cs"
                        ? "Přizpůsobte si vzhled aplikace podle vašich preferencí."
                        : "Customize the application appearance based on your preferences."
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{language === "cs" ? "Tmavý režim" : "Dark Mode"}</Label>
                        <p className="text-sm text-muted-foreground">
                          {language === "cs" 
                            ? "Přepnout na tmavý režim" 
                            : "Switch to dark mode"
                          }
                        </p>
                      </div>
                      <Switch 
                        checked={isDarkMode}
                        onCheckedChange={() => {
                          toggleDarkMode();
                          toast.success(language === "cs" 
                            ? "Režim zobrazení byl změněn" 
                            : "Display mode has been changed"
                          );
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{language === "cs" ? "Jazyk" : "Language"}</Label>
                      <select 
                        className="w-full bg-background border border-input rounded-md h-10 px-3"
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value as "cs" | "en");
                          toast.success(
                            e.target.value === "cs" 
                              ? "Jazyk byl změněn na češtinu" 
                              : "Language has been changed to English"
                          );
                        }}
                      >
                        <option value="cs">Čeština</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscription" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "cs" ? "Předplatné" : "Subscription"}</CardTitle>
                    <CardDescription>
                      {language === "cs"
                        ? "Spravujte své předplatné a fakturační údaje."
                        : "Manage your subscription and billing details."
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      <Card className={`overflow-hidden ${subscriptionStatus.subscriptionType === "free" ? "ring-2 ring-primary" : ""}`}>
                        <CardHeader className="bg-muted/50 p-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              {language === "cs" ? "Basic" : "Basic"}
                            </CardTitle>
                            {subscriptionStatus.subscriptionType === "free" && (
                              <div className="px-2 py-1 rounded-full bg-upkeep-100 text-upkeep-800 text-xs font-medium">
                                {language === "cs" ? "Aktivní" : "Active"}
                              </div>
                            )}
                          </div>
                          <CardDescription className="mt-2">
                            {language === "cs" ? "Zdarma" : "Free"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          <ul className="space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-upkeep-600" />
                              <span className="text-sm">
                                {language === "cs" ? "Až 3 nemovitosti" : "Up to 3 properties"}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-upkeep-600" />
                              <span className="text-sm">
                                {language === "cs" ? "Základní údržba" : "Basic maintenance"}
                              </span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className={`overflow-hidden ${subscriptionStatus.subscriptionType === "monthly" ? "ring-2 ring-primary" : ""}`}>
                        <CardHeader className="bg-muted/50 p-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              {language === "cs" ? "Premium Měsíčně" : "Premium Monthly"}
                            </CardTitle>
                            {subscriptionStatus.subscriptionType === "monthly" && (
                              <div className="px-2 py-1 rounded-full bg-upkeep-100 text-upkeep-800 text-xs font-medium">
                                {language === "cs" ? "Aktivní" : "Active"}
                              </div>
                            )}
                          </div>
                          <CardDescription className="mt-2">
                            27 Kč / {language === "cs" ? "měsíc" : "month"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          <ul className="space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-upkeep-600" />
                              <span className="text-sm">
                                {language === "cs" ? "Neomezené nemovitosti" : "Unlimited properties"}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-upkeep-600" />
                              <span className="text-sm">
                                {language === "cs" ? "Export do PDF" : "PDF export"}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-upkeep-600" />
                              <span className="text-sm">
                                {language === "cs" ? "Priority podpora" : "Priority support"}
                              </span>
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button 
                            className="w-full" 
                            onClick={() => {
                              toast.success(language === "cs" 
                                ? "Brzy spustíme platby - nyní máte dočasný přístup k Premium funkcím" 
                                : "Payments coming soon - you have temporary access to Premium features now"
                              );
                              // Simulating subscription for demo purposes
                              setSubscriptionStatus({
                                isSubscribed: true,
                                subscriptionType: "monthly",
                                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
                              });
                            }}
                          >
                            {language === "cs" ? "Předplatit" : "Subscribe"}
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card className={`overflow-hidden ${subscriptionStatus.subscriptionType === "yearly" ? "ring-2 ring-primary" : ""}`}>
                        <CardHeader className="bg-muted/50 p-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              {language === "cs" ? "Premium Ročně" : "Premium Yearly"}
                            </CardTitle>
                            {subscriptionStatus.subscriptionType === "yearly" && (
                              <div className="px-2 py-1 rounded-full bg-upkeep-100 text-upkeep-800 text-xs font-medium">
                                {language === "cs" ? "Aktivní" : "Active"}
                              </div>
                            )}
                          </div>
                          <CardDescription className="mt-2">
                            297 Kč / {language === "cs" ? "rok" : "year"}
                            <span className="ml-2 inline-block px-1.5 py-0.5 bg-upkeep-100 text-upkeep-800 rounded text-xs">
                              {language === "cs" ? "Ušetříte 15%" : "Save 15%"}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          <ul className="space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-upkeep-600" />
                              <span className="text-sm">
                                {language === "cs" ? "Neomezené nemovitosti" : "Unlimited properties"}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-upkeep-600" />
                              <span className="text-sm">
                                {language === "cs" ? "Export do PDF" : "PDF export"}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-upkeep-600" />
                              <span className="text-sm">
                                {language === "cs" ? "Priority podpora" : "Priority support"}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-upkeep-600" />
                              <span className="text-sm">
                                {language === "cs" ? "Detailní statistiky" : "Detailed statistics"}
                              </span>
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button 
                            className="w-full" 
                            onClick={() => {
                              toast.success(language === "cs" 
                                ? "Brzy spustíme platby - nyní máte dočasný přístup k Premium funkcím" 
                                : "Payments coming soon - you have temporary access to Premium features now"
                              );
                              // Simulating subscription for demo purposes
                              setSubscriptionStatus({
                                isSubscribed: true,
                                subscriptionType: "yearly",
                                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365 days from now
                              });
                            }}
                          >
                            {language === "cs" ? "Předplatit" : "Subscribe"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
