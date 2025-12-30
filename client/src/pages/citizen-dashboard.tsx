import { useStore, Report } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Trash2, Camera, MapPin } from "lucide-react";
import ReportCard from "@/components/report-card";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="font-display font-bold text-xl text-primary">EcoWatch</div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline-block">Welcome, {user.name}</span>
            <Button variant="ghost" size="icon" onClick={() => { logout(); setLocation("/"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight font-display">My Reports</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-lg">
                <Plus className="mr-2 h-4 w-4" /> New Report
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
                    className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted"
                  >
                    {newReport.image ? (
                      <img src={newReport.image} className="h-full w-full object-cover rounded-lg" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Camera className="mb-2 h-8 w-8" />
                        <span className="text-xs">Tap to upload photo</span>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe the waste and location details..." 
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
                      className="bg-muted text-muted-foreground"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={getLocation}>
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

        {myReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Trash2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No reports yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You haven't submitted any waste reports. Spotted something? Report it now.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
