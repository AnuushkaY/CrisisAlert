import { useStore, Report } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Camera, MapPin, LayoutGrid, Map as MapIcon, Globe, Sparkles } from "lucide-react";
import ReportCard from "@/components/report-card";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import MapView from "@/components/map-view";
import Chatbot from "@/components/chatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CitizenDashboard() {
  const { user, reports, logout, addReport } = useStore();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [newReport, setNewReport] = useState({
    description: '',
    image: null as string | null,
    lat: 51.505,
    lng: -0.09
  });

  if (!user) {
    setLocation("/");
    return null;
  }

  const myReports = reports.filter(r => r.userId === user.id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReport(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!newReport.description || !newReport.image) {
      toast({
        title: "Whoops!",
        description: "We need a photo and description to start cleaning!",
        variant: "destructive"
      });
      return;
    }

    addReport({
      userId: user.id,
      userName: user.name,
      description: newReport.description,
      imageUrl: newReport.image,
      location: { lat: newReport.lat, lng: newReport.lng }
    });

    setNewReport({ description: '', image: null, lat: 51.505, lng: -0.09 });
    setIsDialogOpen(false);
    toast({
      title: "Boom! Reported!",
      description: "You're a neighborhood hero. We're on it!",
    });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNewReport(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b-4 border-foreground bg-white px-6">
        <div className="container mx-auto flex h-20 items-center justify-between">
          <div className="font-display font-black text-3xl text-foreground tracking-tighter flex items-center gap-2 italic">
            <Globe className="h-8 w-8 text-blue-500" />
            Env<span className="text-pink-500">Tech</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black uppercase italic tracking-widest">{user.name}</span>
              <div className="neo-badge bg-green-200 text-[8px] py-0 px-2 mt-1">Super Citizen</div>
            </div>
            <Button variant="ghost" className="neo-card h-12 w-12 p-0 flex items-center justify-center hover:bg-pink-100" onClick={() => { logout(); setLocation("/"); }}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between bg-yellow-100 neo-card p-10 tilted-left">
          <div className="space-y-2">
            <div className="neo-badge bg-white mb-2">Neighborhood News</div>
            <h1 className="text-5xl font-black font-display tracking-tighter uppercase italic">Your Impact Hub</h1>
            <p className="text-xl font-bold opacity-70 italic">"Cleaning the world, one tap at a time."</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-20 px-10 rounded-full bg-foreground text-white border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all text-2xl font-black uppercase tracking-tighter italic">
                <Plus className="mr-3 h-8 w-8" /> Spot Something?
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] neo-card p-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">New Report Card</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="font-black text-xs uppercase tracking-widest opacity-60">Snap a photo</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-4 border-dashed border-foreground bg-slate-50 hover:bg-white transition-all overflow-hidden relative"
                  >
                    {newReport.image ? (
                      <img src={newReport.image} className="h-full w-full object-cover" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center text-foreground text-center p-6">
                        <Camera className="mb-3 h-12 w-12" />
                        <span className="text-sm font-black uppercase italic tracking-wider">Tap to Camera</span>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label className="font-black text-xs uppercase tracking-widest opacity-60">What did you see?</Label>
                  <Textarea 
                    placeholder="Describe the mess..." 
                    className="rounded-2xl border-4 border-foreground min-h-[100px] font-bold"
                    value={newReport.description}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="font-black text-xs uppercase tracking-widest opacity-60">Magic Location</Label>
                  <div className="flex gap-3">
                    <Input 
                      value={`${newReport.lat.toFixed(4)}, ${newReport.lng.toFixed(4)}`} 
                      readOnly 
                      className="rounded-xl bg-slate-100 border-2 border-foreground font-black text-xs italic h-12"
                    />
                    <Button type="button" className="neo-card h-12 w-12 p-0 flex items-center justify-center bg-blue-400" onClick={getLocation}>
                      <MapPin className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit} className="w-full h-16 neo-button text-xl">SEND TO THE TEAM</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="my-reports" className="w-full">
          <TabsList className="inline-flex h-14 items-center justify-center rounded-2xl bg-white p-2 mb-12 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TabsTrigger value="my-reports" className="flex items-center gap-2 rounded-xl px-8 py-2 font-black uppercase text-xs tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-white transition-all">
              <LayoutGrid className="h-4 w-4" /> My Stickers
            </TabsTrigger>
            <TabsTrigger value="city-map" className="flex items-center gap-2 rounded-xl px-8 py-2 font-black uppercase text-xs tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-white transition-all">
              <MapIcon className="h-4 w-4" /> The Grid
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-reports" className="animate-in fade-in duration-500">
            {myReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center neo-card bg-white tilted-right p-10">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 border-4 border-foreground">
                  <Sparkles className="h-10 w-10 text-pink-500" />
                </div>
                <h3 className="mt-8 text-4xl font-black font-display tracking-tighter uppercase italic">Nothing here!</h3>
                <p className="mx-auto mt-4 max-w-[340px] text-xl font-bold opacity-70 italic leading-snug">
                  You haven't reported anything yet. Time to be a hero!
                </p>
              </div>
            ) : (
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {myReports.map((report, idx) => (
                  <div key={report.id} className={idx % 2 === 0 ? "tilted-left" : "tilted-right"}>
                    <ReportCard report={report} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="city-map" className="h-[700px] animate-in zoom-in-95 duration-500">
             <div className="h-full w-full rounded-[2.5rem] overflow-hidden border-8 border-foreground shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-white">
               <MapView reports={reports} />
             </div>
          </TabsContent>
        </Tabs>
      </main>

      <Chatbot />
    </div>
  );
}
