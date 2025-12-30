import { useStore, Report } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Camera, MapPin, LayoutGrid, Map as MapIcon, Globe, Sparkles, TrendingUp, Users } from "lucide-react";
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

import { detectTrash } from "@/lib/ai";

export default function CitizenDashboard() {
  const { user, reports, logout, addReport } = useStore();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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

  const handleSubmit = async () => {
    if (!newReport.description || !newReport.image) {
      toast({
        title: "Action Required!",
        description: "A photo and description are essential for the clean-up team!",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const img = new Image();
      img.src = newReport.image;
      await new Promise(resolve => img.onload = resolve);
      
      const hasTrash = await detectTrash(img);
      
      if (!hasTrash && !newReport.description.toLowerCase().includes('trash')) {
        toast({
          title: "AI Analysis",
          description: "No trash detected in this image. Please ensure it's a clear photo of the hotspot.",
          variant: "destructive"
        });
        setIsVerifying(false);
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
        title: "Successfully Logged!",
        description: "AI verified trash. Your report is now in the system!",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
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
      <header className="sticky top-0 z-40 border-b-8 border-foreground bg-white px-8">
        <div className="container mx-auto flex h-24 items-center justify-between">
          <div className="font-display font-black text-4xl text-foreground tracking-tighter flex items-center gap-3 italic">
            <div className="bg-primary p-2 border-4 border-foreground rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Globe className="h-8 w-8 text-white" />
            </div>
            Env<span className="text-accent">Tech</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 bg-secondary p-3 border-4 border-foreground rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] tilted-right">
              <Users className="h-5 w-5" />
              <span className="text-sm font-black uppercase tracking-widest">{user.name}</span>
            </div>
            <Button variant="ghost" className="neo-card h-14 w-14 p-0 flex items-center justify-center bg-accent hover:bg-accent/80" onClick={() => { logout(); setLocation("/"); }}>
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-16 space-y-20">
        {/* Rich Hero Section (Bhara-Bhara) */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="flex gap-4">
              <div className="neo-badge bg-white">City Live</div>
              <div className="neo-badge bg-secondary">Impact: High</div>
            </div>
            <h1 className="text-8xl font-black font-display tracking-tighter uppercase italic leading-[0.85]">
              Cleaner <br/> <span className="text-primary underline decoration-8 decoration-foreground underline-offset-8">Future</span> <br/> Starts Now
            </h1>
            <p className="text-2xl font-black opacity-80 italic max-w-lg leading-tight">
              Join 2,400+ citizens actively transforming their urban landscapes through decentralized reporting.
            </p>
            <div className="flex gap-6">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="neo-button h-24 px-12 text-3xl italic scale-110 hover:scale-115">
                    <Plus className="mr-4 h-10 w-10" /> Spot Something?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] neo-card p-10 z-[100]">
                  <DialogHeader>
                    <DialogTitle className="text-4xl font-black uppercase italic tracking-tighter">New Field Report</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-8 py-6 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Evidence Capture</Label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-60 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-4 border-dashed border-foreground bg-muted hover:bg-white transition-all overflow-hidden relative"
                      >
                        {newReport.image ? (
                          <img src={newReport.image} className="h-full w-full object-cover" alt="Preview" />
                        ) : (
                          <div className="flex flex-col items-center text-foreground text-center p-8">
                            <Camera className="mb-4 h-16 w-16" />
                            <span className="text-lg font-black uppercase italic tracking-wider">Tap to Camera</span>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </div>
                    </div>
                    
                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Detail Log</Label>
                      <Textarea 
                        placeholder="What's the situation on the ground?" 
                        className="rounded-[1.5rem] border-4 border-foreground min-h-[120px] font-black text-lg p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        value={newReport.description}
                        onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Coordination</Label>
                      <div className="flex gap-4">
                        <Input 
                          value={`${newReport.lat.toFixed(4)}, ${newReport.lng.toFixed(4)}`} 
                          readOnly 
                          className="rounded-2xl bg-white border-4 border-foreground font-black text-base italic h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        />
                        <Button type="button" className="neo-card h-14 w-14 p-0 flex items-center justify-center bg-blue-card shrink-0" onClick={getLocation}>
                          <MapPin className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full h-20 neo-button text-2xl">TRANSMIT TO COMMAND</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-6 animate-in zoom-in-95 duration-700">
             <div className="neo-card bg-accent p-8 space-y-4 tilted-left h-64 flex flex-col justify-center text-center">
                <TrendingUp className="h-12 w-12 mx-auto" />
                <div className="text-4xl font-black leading-none">92%</div>
                <div className="font-black uppercase tracking-widest text-xs">Cleanliness Score</div>
             </div>
             <div className="neo-card bg-blue-card p-8 space-y-4 tilted-right h-64 flex flex-col justify-center text-center mt-12">
                <Globe className="h-12 w-12 mx-auto" />
                <div className="text-4xl font-black leading-none">12K</div>
                <div className="font-black uppercase tracking-widest text-xs">Spots Cleared</div>
             </div>
          </div>
        </section>

        <Tabs defaultValue="my-reports" className="w-full space-y-12">
          <TabsList className="inline-flex h-20 items-center justify-center rounded-[2rem] bg-foreground p-2 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
            <TabsTrigger value="my-reports" className="flex items-center gap-3 rounded-[1.5rem] px-12 py-3 font-black uppercase text-sm tracking-widest data-[state=active]:bg-white data-[state=active]:text-foreground transition-all text-white/60">
              <LayoutGrid className="h-5 w-5" /> Activity Log
            </TabsTrigger>
            <TabsTrigger value="city-map" className="flex items-center gap-3 rounded-[1.5rem] px-12 py-3 font-black uppercase text-sm tracking-widest data-[state=active]:bg-white data-[state=active]:text-foreground transition-all text-white/60">
              <MapIcon className="h-5 w-5" /> Strategic Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-reports" className="animate-in fade-in duration-500">
            {myReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center neo-card bg-white tilted-right p-16">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-accent border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles className="h-16 w-16" />
                </div>
                <h3 className="mt-12 text-6xl font-black font-display tracking-tighter uppercase italic">Grid is Clear</h3>
                <p className="mx-auto mt-6 max-w-md text-2xl font-black opacity-80 italic leading-snug">
                  Excellent work, Citizen. You currently have no active alerts in your sector.
                </p>
              </div>
            ) : (
              <div className="bhara-bhara-grid">
                {myReports.map((report, idx) => (
                  <div key={report.id} className={`animate-in slide-in-from-bottom-${idx * 2} duration-500 ${idx % 2 === 0 ? "tilted-left" : "tilted-right"}`}>
                    <ReportCard report={report} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="city-map" className="h-[800px] animate-in zoom-in-95 duration-500 relative">
             <div className="h-full w-full rounded-[3rem] overflow-hidden border-[12px] border-foreground shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] bg-white relative">
               <div className="absolute top-8 left-8 z-20 neo-badge bg-white shadow-none">Live Response Grid</div>
               <MapView reports={reports} />
             </div>
          </TabsContent>
        </Tabs>
      </main>

      <Chatbot />
    </div>
  );
}
