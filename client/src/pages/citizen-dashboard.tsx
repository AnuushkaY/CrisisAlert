import { useStore, Report } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Trash2, Camera, MapPin, LayoutGrid, Map as MapIcon } from "lucide-react";
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
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="font-display font-bold text-xl text-primary flex items-center gap-2">
            EcoWatch <span className="text-xs font-sans text-muted-foreground px-2 py-0.5 bg-muted rounded">Citizen</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm font-medium hidden sm:inline-block">Hi, {user.name}</span>
            <Button variant="ghost" size="icon" onClick={() => { logout(); setLocation("/"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-display">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your reports and view city hotspots.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                <Plus className="mr-2 h-5 w-5" /> Report Hotspot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Report Waste Hotspot</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Evidence Photo</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {newReport.image ? (
                      <img src={newReport.image} className="h-full w-full object-cover rounded-lg" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground text-center p-4">
                        <Camera className="mb-2 h-8 w-8 opacity-50" />
                        <span className="text-xs font-medium">Capture or upload photo</span>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="e.g. Broken furniture on the corner of..." 
                    value={newReport.description}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Location</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={`${newReport.lat.toFixed(4)}, ${newReport.lng.toFixed(4)}`} 
                      readOnly 
                      className="bg-muted"
                    />
                    <Button type="button" variant="secondary" size="icon" onClick={getLocation}>
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit} className="w-full">Submit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="my-reports" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
            <TabsTrigger value="my-reports" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> My Reports
            </TabsTrigger>
            <TabsTrigger value="city-map" className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" /> City Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-reports" className="animate-in fade-in duration-300">
            {myReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Trash2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">No reports yet</h3>
                <p className="mx-auto mt-2 max-w-[300px] text-muted-foreground">
                  You haven't reported any hotspots. Use the button above to help clean your city.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="city-map" className="h-[600px] rounded-2xl overflow-hidden border shadow-lg animate-in zoom-in-95 duration-300">
            <MapView reports={reports} />
          </TabsContent>
        </Tabs>
      </main>

      <Chatbot />
    </div>
  );
}
