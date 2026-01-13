import { useStore, Incident } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Camera, MapPin, LayoutGrid, Map as MapIcon, Globe, Sparkles, AlertTriangle, Bell, Users } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import MapView from "@/components/map-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CitizenDashboard() {
  const { user, incidents, alerts, logout, addIncident } = useStore();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    category: 'other' as const,
    severity: 'medium' as const,
    priority: 'medium' as const,
    images: [] as string[],
    lat: 51.505,
    lng: -0.09,
    address: ''
  });

  if (!user) {
    setLocation("/");
    return null;
  }

  const myIncidents = incidents.filter(i => i.reportedBy === user.id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setNewIncident(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async () => {
    if (!newIncident.title || !newIncident.description) {
      toast({
        title: "Action Required!",
        description: "Title and description are essential for emergency response!",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Mocking processing time
      await new Promise(resolve => setTimeout(resolve, 500));

      addIncident({
        title: newIncident.title,
        description: newIncident.description,
        category: newIncident.category,
        severity: newIncident.severity,
        priority: newIncident.priority,
        status: 'reported',
        reportedBy: user.id,
        location: {
          lat: newIncident.lat,
          lng: newIncident.lng,
          address: newIncident.address
        },
        images: newIncident.images
      });

      setNewIncident({
        title: '',
        description: '',
        category: 'other',
        severity: 'medium',
        priority: 'medium',
        images: [],
        lat: 51.505,
        lng: -0.09,
        address: ''
      });
      setIsDialogOpen(false);
      toast({
        title: "Successfully Reported!",
        description: "Emergency services have been notified. Help is on the way!",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to process report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNewIncident(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b-8 border-foreground bg-white px-8">
        <div className="container mx-auto flex h-24 items-center justify-between">
          <div className="font-display font-black text-4xl text-foreground tracking-tighter flex items-center gap-3 italic">
            <div className="bg-primary p-2 border-4 border-foreground rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Globe className="h-8 w-8 text-white" />
            </div>
            Crisis<span className="text-accent">Alert</span>
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
        {/* Rich Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="flex gap-4">
              <div className="neo-badge bg-red-500">Emergency Ready</div>
              <div className="neo-badge bg-blue-500">Response: Active</div>
            </div>
            <h1 className="text-8xl font-black font-display tracking-tighter uppercase italic leading-[0.85]">
              Crisis <br/> <span className="text-red-500 underline decoration-8 decoration-foreground underline-offset-8">Response</span> <br/> Network
            </h1>
            <p className="text-2xl font-black opacity-80 italic max-w-lg leading-tight">
              Join 10,000+ citizens actively reporting emergencies and coordinating community response.
            </p>
            <div className="flex gap-6">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="neo-button h-24 px-12 text-3xl italic bg-red-500 hover:bg-red-600">
                    <Plus className="mr-4 h-10 w-10" /> Report Emergency
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-4 border-foreground rounded-[1.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="pb-6">
                    <DialogTitle className="text-4xl font-black uppercase italic tracking-tighter">Emergency Report</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Incident Title</Label>
                      <Input
                        placeholder="Brief description of the emergency"
                        className="rounded-[1.5rem] border-4 border-foreground min-h-[60px] font-black text-lg p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        value={newIncident.title}
                        onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Emergency Details</Label>
                      <Textarea
                        placeholder="Describe the situation in detail..."
                        className="rounded-[1.5rem] border-4 border-foreground min-h-[120px] font-black text-lg p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        value={newIncident.description}
                        onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-3">
                        <Label className="font-black text-sm uppercase tracking-widest">Category</Label>
                        <Select value={newIncident.category} onValueChange={(value: any) => setNewIncident(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger className="rounded-2xl border-4 border-foreground font-black text-lg h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fire">Fire</SelectItem>
                            <SelectItem value="flood">Flood</SelectItem>
                            <SelectItem value="medical">Medical</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="environmental">Environmental</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label className="font-black text-sm uppercase tracking-widest">Severity</Label>
                        <Select value={newIncident.severity} onValueChange={(value: any) => setNewIncident(prev => ({ ...prev, severity: value }))}>
                          <SelectTrigger className="rounded-2xl border-4 border-foreground font-black text-lg h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label className="font-black text-sm uppercase tracking-widest">Priority</Label>
                        <Select value={newIncident.priority} onValueChange={(value: any) => setNewIncident(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger className="rounded-2xl border-4 border-foreground font-black text-lg h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Evidence & Photos</Label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-4 border-dashed border-foreground bg-muted hover:bg-white transition-all overflow-hidden relative"
                      >
                        {newIncident.images.length > 0 ? (
                          <div className="flex gap-2 overflow-x-auto w-full p-4">
                            {newIncident.images.map((img, idx) => (
                              <img key={idx} src={img} className="h-32 w-32 object-cover rounded-xl border-2 border-foreground" alt={`Evidence ${idx + 1}`} />
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-foreground text-center p-8">
                            <Camera className="mb-4 h-16 w-16" />
                            <span className="text-lg font-black uppercase italic tracking-wider">Add Photos</span>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Location</Label>
                      <div className="flex gap-4">
                        <Input
                          placeholder="Address or location description"
                          className="rounded-2xl bg-white border-4 border-foreground font-black text-base italic h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          value={newIncident.address}
                          onChange={(e) => setNewIncident(prev => ({ ...prev, address: e.target.value }))}
                        />
                        <Button type="button" className="neo-card h-14 w-14 p-0 flex items-center justify-center bg-blue-card shrink-0" onClick={getLocation}>
                          <MapPin className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full h-20 neo-button text-2xl bg-red-500 hover:bg-red-600">
                      {isVerifying ? "PROCESSING..." : "SEND EMERGENCY ALERT"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-6 animate-in zoom-in-95 duration-700">
             <div className="neo-card bg-red-500 p-8 space-y-4 tilted-left h-64 flex flex-col justify-center text-center">
                <AlertTriangle className="h-12 w-12 mx-auto" />
                <div className="text-4xl font-black leading-none">{incidents.filter(i => i.status !== 'resolved').length}</div>
                <div className="font-black uppercase tracking-widest text-xs">Active Emergencies</div>
             </div>
             <div className="neo-card bg-blue-500 p-8 space-y-4 tilted-right h-64 flex flex-col justify-center text-center mt-12">
                <Bell className="h-12 w-12 mx-auto" />
                <div className="text-4xl font-black leading-none">{alerts.length}</div>
                <div className="font-black uppercase tracking-widest text-xs">Active Alerts</div>
             </div>
          </div>
        </section>

        <Tabs defaultValue="my-reports" className="w-full space-y-12">
          <TabsList className="inline-flex h-20 items-center justify-center rounded-[2rem] bg-foreground p-2 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
            <TabsTrigger value="my-reports" className="flex items-center gap-3 rounded-[1.5rem] px-12 py-3 font-black uppercase text-sm tracking-widest data-[state=active]:bg-white data-[state=active]:text-foreground transition-all text-white/60">
              <LayoutGrid className="h-5 w-5" /> My Reports
            </TabsTrigger>
            <TabsTrigger value="city-map" className="flex items-center gap-3 rounded-[1.5rem] px-12 py-3 font-black uppercase text-sm tracking-widest data-[state=active]:bg-white data-[state=active]:text-foreground transition-all text-white/60">
              <MapIcon className="h-5 w-5" /> Crisis Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-reports" className="animate-in fade-in duration-500">
            {myIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center neo-card bg-white tilted-right p-16">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-green-500 border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles className="h-16 w-16" />
                </div>
                <h3 className="mt-12 text-6xl font-black font-display tracking-tighter uppercase italic">All Clear</h3>
                <p className="mx-auto mt-6 max-w-md text-2xl font-black opacity-80 italic leading-snug">
                  Excellent work, Citizen. You currently have no active emergency reports.
                </p>
              </div>
            ) : (
              <div className="bhara-bhara-grid">
                {myIncidents.map((incident, idx) => (
                  <div key={incident.id} className={`animate-in slide-in-from-bottom-${idx * 2} duration-500 ${idx % 2 === 0 ? "tilted-left" : "tilted-right"}`}>
                    <Card className="neo-card p-6">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-black">{incident.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant={incident.severity === 'critical' ? 'destructive' : incident.severity === 'high' ? 'default' : 'secondary'}>
                            {incident.severity}
                          </Badge>
                          <Badge variant="outline">{incident.category}</Badge>
                          <Badge variant={incident.status === 'resolved' ? 'default' : 'destructive'}>
                            {incident.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{incident.description}</p>
                        <div className="text-sm text-muted-foreground">
                          Reported: {new Date(incident.createdAt).toLocaleString()}
                        </div>
                        {incident.images && incident.images.length > 0 && (
                          <div className="mt-4 flex gap-2 overflow-x-auto">
                            {incident.images.map((img, imgIdx) => (
                              <img key={imgIdx} src={img} className="h-20 w-20 object-cover rounded-lg border-2 border-foreground" alt={`Evidence ${imgIdx + 1}`} />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="city-map" className="h-[800px] animate-in zoom-in-95 duration-500 relative">
             <div className="h-full w-full rounded-[3rem] overflow-hidden border-[12px] border-foreground shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] bg-white relative">
               <div className="absolute top-8 left-8 z-20 neo-badge bg-red-500 shadow-none">Live Crisis Grid</div>
               <MapView incidents={incidents} alerts={alerts} />
             </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
