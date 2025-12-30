import { useState } from "react";
import { useStore, Role } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, ShieldCheck, ArrowRight } from "lucide-react";
import generatedImage from '@assets/generated_images/minimalist_eco_city_map_background.png';

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const login = useStore((state) => state.login);
  const [, setLocation] = useLocation();

  const handleLogin = (role: Role) => {
    if (!email) return; 
    login(email, role);
    setLocation(role === 'authority' ? '/authority' : '/citizen');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background overflow-hidden">
      <div className="flex flex-col items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Zap className="h-3 w-3 fill-current" />
              The Future of Sustainability
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter font-display text-foreground leading-[0.9]">
              EnvironmentTech
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Intelligent waste monitoring for modern smart cities.
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6 px-6">
              <Tabs defaultValue="citizen" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-xl mb-8">
                  <TabsTrigger value="citizen" className="rounded-lg py-2.5 font-bold">Citizen</TabsTrigger>
                  <TabsTrigger value="authority" className="rounded-lg py-2.5 font-bold">Authority</TabsTrigger>
                </TabsList>
                
                <TabsContent value="citizen" className="space-y-4 animate-in fade-in slide-in-from-left-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest opacity-60">Citizen Identifier</Label>
                    <Input 
                      placeholder="Enter your email" 
                      className="h-12 rounded-xl border-2 focus:border-primary transition-all bg-background"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button className="w-full h-14 rounded-xl text-lg font-bold group" onClick={() => handleLogin('citizen')}>
                    Enter Platform
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </TabsContent>
                
                <TabsContent value="authority" className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest opacity-60">Admin Credentials</Label>
                    <Input 
                      placeholder="Work Email" 
                      className="h-12 rounded-xl border-2 focus:border-primary transition-all bg-background"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button variant="secondary" className="w-full h-14 rounded-xl text-lg font-bold group border-2 border-primary/10" onClick={() => handleLogin('authority')}>
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Admin Portal
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground font-medium">
            EnvironmentTech Open Prototype • v2.4.0
          </p>
        </div>
      </div>
      
      <div className="hidden lg:block relative p-8">
        <div className="h-full w-full rounded-[2.5rem] overflow-hidden relative shadow-2xl border-8 border-white/50">
          <img 
            src={generatedImage} 
            alt="Eco Tech Grid" 
            className="absolute inset-0 h-full w-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black/80 flex flex-col justify-end p-12">
            <div className="space-y-4">
              <div className="h-1 w-24 bg-white rounded-full" />
              <h2 className="text-4xl font-bold text-white font-display leading-tight">
                Cleaning cities through data and community action.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
