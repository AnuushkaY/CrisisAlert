import { useState } from "react";
import { useStore, Role } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Shield } from "lucide-react";
import generatedImage from '@assets/generated_images/minimalist_eco_city_map_background.png';

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useStore((state) => state.login);
  const [, setLocation] = useLocation();

  const handleLogin = (role: Role) => {
    if (!email) return; 
    login(email, role);
    setLocation(role === 'authority' ? '/authority' : '/citizen');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">EcoWatch</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to report or manage waste hotspots
            </p>
          </div>

          <Tabs defaultValue="citizen" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="citizen">Citizen</TabsTrigger>
              <TabsTrigger value="authority">Authority</TabsTrigger>
            </TabsList>
            
            <TabsContent value="citizen">
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-4 px-0">
                  <div className="space-y-2">
                    <Label htmlFor="email-citizen">Email</Label>
                    <Input 
                      id="email-citizen" 
                      placeholder="citizen@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-citizen">Password</Label>
                    <Input 
                      id="password-citizen" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full mt-4" onClick={() => handleLogin('citizen')}>
                    Login as Citizen
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="authority">
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-4 px-0">
                  <div className="space-y-2">
                    <Label htmlFor="email-auth">Work Email</Label>
                    <Input 
                      id="email-auth" 
                      placeholder="admin@city.gov" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-auth">Password</Label>
                    <Input 
                      id="password-auth" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button variant="secondary" className="w-full mt-4" onClick={() => handleLogin('authority')}>
                    <Shield className="mr-2 h-4 w-4" />
                    Login to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center text-xs text-muted-foreground">
            <p>Demo Mode: Any password works.</p>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block relative bg-muted">
        <img 
          src={generatedImage} 
          alt="City Map" 
          className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
          <blockquote className="space-y-2 text-white">
            <p className="text-lg font-medium leading-relaxed">
              "Keeping our city clean is a shared responsibility. EcoWatch empowers everyone to make a difference, one report at a time."
            </p>
            <footer className="text-sm opacity-80">Department of Environmental Services</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
