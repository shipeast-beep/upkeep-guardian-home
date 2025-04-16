
import React from "react";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User, Languages, Moon, Sun, CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 lg:w-1/5">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nastavení</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                  <TabsList className="w-full flex flex-col items-stretch h-auto">
                    <TabsTrigger value="profile" className="justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profil
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      Oznámení
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="justify-start">
                      <Sun className="w-4 h-4 mr-2" />
                      Vzhled
                    </TabsTrigger>
                    <TabsTrigger value="subscription" className="justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Předplatné
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-3/4 lg:w-4/5">
            <Tabs defaultValue="profile" orientation="horizontal" className="w-full">
              <TabsContent value="profile" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil</CardTitle>
                    <CardDescription>
                      Spravujte své uživatelské údaje a nastavení účtu.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Jméno</Label>
                      <Input id="name" placeholder="Jméno" defaultValue={user?.email?.split('@')[0] || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" disabled value={user?.email || ""} />
                    </div>
                    <div className="pt-4 flex items-center justify-between">
                      <Button variant="outline" onClick={handleSignOut} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Odhlásit se
                      </Button>
                      <Button>Uložit změny</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Oznámení</CardTitle>
                    <CardDescription>
                      Nastavte si způsoby a četnost oznámení o údržbě.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email oznámení</Label>
                        <p className="text-sm text-muted-foreground">
                          Dostávejte oznámení na email
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Připomenutí týden předem</Label>
                        <p className="text-sm text-muted-foreground">
                          Dostávejte připomenutí týden před plánovanou údržbou
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Připomenutí den předem</Label>
                        <p className="text-sm text-muted-foreground">
                          Dostávejte připomenutí den před plánovanou údržbou
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
                    <CardTitle>Vzhled</CardTitle>
                    <CardDescription>
                      Přizpůsobte si vzhled aplikace podle vašich preferencí.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Tmavý režim</Label>
                        <p className="text-sm text-muted-foreground">
                          Přepnout na tmavý režim
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label>Jazyk</Label>
                      <select className="w-full bg-background border border-input rounded-md h-10 px-3">
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
                    <CardTitle>Předplatné</CardTitle>
                    <CardDescription>
                      Spravujte své předplatné a fakturační údaje.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">Basic plán</h3>
                          <p className="text-sm text-muted-foreground">Zdarma</p>
                        </div>
                        <div className="px-2 py-1 rounded-full bg-upkeep-100 text-upkeep-800 text-xs font-medium">
                          Aktivní
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button asChild className="mt-4">
                        <a href="/pricing">Upgradovat na Premium</a>
                      </Button>
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
