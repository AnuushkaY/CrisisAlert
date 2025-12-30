import { useStore, Report } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Trash2, Camera, MapPin, LayoutGrid, Map as MapIcon, Globe } from "lucide-react";
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
        title: "Missing Information",
        description: "Please provide both a description and an image.",
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
      title: "Report Submitted",
      description: "Thank you for helping keep our city clean!",
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
        toast({ title: "Location Updated", description: "Using your current GPS location." });
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="font-display font-extrabold text-2xl text-primary tracking-tighter flex items-center gap-2">
            <Globe className="h-6 w-6" />
            EnvironmentTech
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold">{user.name}</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Active Citizen</span>
            </div>
            <Button variant="outline" size="icon" className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={() => { logout(); setLocation("/"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight font-display">Citizen Dashboard</h1>
            <p className="text-lg text-muted-foreground font-medium">Be the eyes of your community. Report, track, and clean.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-2xl h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                <Plus className="mr-2 h-6 w-6" /> Create New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl">New Waste Report</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="font-bold text-xs uppercase tracking-widest opacity-60">Visual Evidence</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group overflow-hidden"
                  >
                    {newReport.image ? (
                      <img src={newReport.image} className="h-full w-full object-cover" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center text-primary text-center p-6">
                        <Camera className="mb-3 h-10 w-10 opacity-50 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-wider">Tap to Capture</span>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label className="font-bold text-xs uppercase tracking-widest opacity-60">Observation</Label>
                  <Textarea 
                    placeholder="Describe the waste hotspot..." 
                    className="rounded-xl border-2 min-h-[100px]"
                    value={newReport.description}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="font-bold text-xs uppercase tracking-widest opacity-60">Geospatial Data</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={`${newReport.lat.toFixed(6)}, ${newReport.lng.toFixed(6)}`} 
                      readOnly 
                      className="rounded-xl bg-muted border-0 font-mono text-xs"
                    />
                    <Button type="button" variant="secondary" size="icon" className="rounded-xl shrink-0" onClick={getLocation}>
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit} className="w-full h-14 rounded-xl text-lg font-bold">Transmit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="my-reports" className="w-full">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-muted p-1 mb-10 border shadow-inner">
            <TabsTrigger value="my-reports" className="flex items-center gap-2 rounded-lg px-6 py-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <LayoutGrid className="h-4 w-4" /> Activity
            </TabsTrigger>
            <TabsTrigger value="city-map" className="flex items-center gap-2 rounded-lg px-6 py-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <MapIcon className="h-4 w-4" /> Global Grid
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-reports" className="animate-in fade-in duration-500">
            {myReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-primary/10 py-24 text-center glass-panel">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Trash2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-6 text-2xl font-extrabold font-display">Zero Incidents Reported</h3>
                <p className="mx-auto mt-3 max-w-[340px] text-muted-foreground font-medium">
                  The streets look clear through your eyes. If you spot a hotspot, you know what to do.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {myReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="city-map" className="h-[700px] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl animate-in zoom-in-95 duration-500 bg-muted">
            <MapView reports={reports} />
          </TabsContent>
        </Tabs>
      </main>

      <Chatbot />
    </div>
  );
}
