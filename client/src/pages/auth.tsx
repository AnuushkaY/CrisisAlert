import { useState } from "react";
import { useStore, Role } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ShieldCheck, ArrowRight, Globe } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useStore((state) => state.login);
  const [, setLocation] = useLocation();

  const handleLogin = (role: Role) => {
    if (!email || !password) return; 
    try {
      login(email, role, password);
      const routeMap = {
        citizen: '/citizen',
        coordinator: '/coordinator',
        agency: '/agency'
      };
      setLocation(routeMap[role] || '/citizen');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Playful background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px] opacity-20" />

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black font-display text-foreground leading-none tracking-tighter">
            Crisis<span className="text-accent-foreground">Alert</span>
          </h1>
          <p className="text-xl text-muted-foreground font-bold italic">
            "Rapid response, community safety, one alert at a time!"
          </p>
        </div>

        <div className="neo-card tilted-right p-2">
          <Card className="border-0 shadow-none bg-white rounded-[1rem]">
            <CardContent className="pt-8 px-6 pb-8">
              <Tabs defaultValue="citizen" className="w-full">
                <TabsList className="grid w-full grid-cols-3 p-1 bg-muted rounded-full mb-8 border-2 border-foreground">
                  <TabsTrigger value="citizen" className="rounded-full py-2 font-black uppercase text-xs tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-white transition-all">Citizen</TabsTrigger>
                  <TabsTrigger value="coordinator" className="rounded-full py-2 font-black uppercase text-xs tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-white transition-all">Coordinator</TabsTrigger>
                  <TabsTrigger value="agency" className="rounded-full py-2 font-black uppercase text-xs tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-white transition-all">Agency</TabsTrigger>
                </TabsList>
                
                <TabsContent value="citizen" className="space-y-6 animate-in fade-in zoom-in-95">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest ml-1">Who are you?</Label>
                    <Input 
                      placeholder="Type your email..." 
                      className="h-14 rounded-2xl border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all bg-white font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input 
                      type="password"
                      placeholder="Password" 
                      className="h-14 rounded-2xl border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all bg-white font-bold"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full h-16 neo-button text-xl uppercase tracking-tighter group" onClick={() => handleLogin('citizen')}>
                    Start Reporting
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </TabsContent>
                
                <TabsContent value="coordinator" className="space-y-6 animate-in fade-in zoom-in-95">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest ml-1">Coordinator Access</Label>
                    <Input 
                      placeholder="Coordinator Email" 
                      className="h-14 rounded-2xl border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all bg-white font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input 
                      type="password"
                      placeholder="Password" 
                      className="h-14 rounded-2xl border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all bg-white font-bold"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full h-16 neo-button bg-green-400 text-foreground border-foreground text-xl uppercase tracking-tighter group" onClick={() => handleLogin('coordinator')}>
                    <ShieldCheck className="mr-2 h-6 w-6" />
                    Coordinate Response
                  </Button>
                </TabsContent>
                
                <TabsContent value="agency" className="space-y-6 animate-in fade-in zoom-in-95">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest ml-1">Agency Access</Label>
                    <Input 
                      placeholder="Agency Email" 
                      className="h-14 rounded-2xl border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all bg-white font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input 
                      type="password"
                      placeholder="Password" 
                      className="h-14 rounded-2xl border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all bg-white font-bold"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full h-16 neo-button bg-red-400 text-foreground border-foreground text-xl uppercase tracking-tighter group" onClick={() => handleLogin('agency')}>
                    <ShieldCheck className="mr-2 h-6 w-6" />
                    Agency Response
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4 text-xs font-black uppercase tracking-widest opacity-40">
          <span>Friendly</span>
          <span>•</span>
          <span>Modern</span>
          <span>•</span>
          <span>Civic</span>
        </div>
      </div>
    </div>
  );
}
