import { useStore, Status } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, Filter, Map as MapIcon, List, ShieldCheck, Globe, Camera } from "lucide-react";
import ReportCard from "@/components/report-card";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import MapView from "@/components/map-view";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Chatbot from "@/components/chatbot";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { verifyCleanliness } from "@/lib/ai";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AuthorityDashboard() {
  const { user, reports, logout, updateReportStatus, deleteReport } = useStore();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [statusFilter, setStatusFilter] = useState<Status[]>(['open', 'in-progress', 'resolved']);
  
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null);
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user || user.role !== 'authority') {
    setLocation("/");
    return null;
  }

  const handleStatusChange = (id: string, status: Status) => {
    if (status === 'resolved') {
      setResolvingReportId(id);
      return;
    }
    updateReportStatus(id, status);
  };

  const handleResolvedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResolvedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalizeResolution = async () => {
    if (!resolvedImage || !resolvingReportId) return;
    
    setIsVerifying(true);
    try {
      const img = new Image();
      img.src = resolvedImage;
      await new Promise(resolve => img.onload = resolve);
      
      const isClean = await verifyCleanliness(img);
      
      if (!isClean) {
        toast({
          title: "AI Analysis",
          description: "Trash still detected. Please ensure the area is fully cleaned before resolving.",
          variant: "destructive"
        });
        return;
      }

      updateReportStatus(resolvingReportId, 'resolved', resolvedImage);
      setResolvingReportId(null);
      setResolvedImage(null);
      toast({
        title: "Report Resolved",
        description: "AI verified the area is clean. Thank you for your work!",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredReports = reports.filter(r => statusFilter.includes(r.status));

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden selection:bg-primary/20">
      <header className="flex h-20 shrink-0 items-center justify-between border-b px-8 bg-card/50 backdrop-blur-xl z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="font-display font-extrabold text-3xl text-primary tracking-tighter flex items-center gap-3">
            <Globe className="h-8 w-8" />
            EnvironmentTech
            <span className="text-[10px] font-sans text-white px-2.5 py-1 bg-primary rounded-full uppercase tracking-[0.2em] font-black shadow-lg shadow-primary/20">Auth</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-black uppercase tracking-tight">{user.name}</span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-[0.15em] opacity-80">Command Center</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 border hover:bg-destructive/10 hover:text-destructive transition-all" onClick={() => { logout(); setLocation("/"); }}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-full max-w-md flex-col border-r bg-muted/20 hidden lg:flex shadow-2xl z-20">
          <div className="p-8 border-b space-y-8 bg-card/30">
            <div className="flex items-center justify-between">
              <h2 className="font-black font-display text-2xl tracking-tight">Active Grid</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 font-bold border-2">
                    <Filter className="mr-2 h-4 w-4" /> Sorting
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-2">
                  <DropdownMenuCheckboxItem 
                    className="rounded-lg font-bold"
                    checked={statusFilter.includes('open')}
                    onCheckedChange={(checked) => {
                      if(checked) setStatusFilter([...statusFilter, 'open']);
                      else setStatusFilter(statusFilter.filter(s => s !== 'open'));
                    }}
                  >
                    Open Incidents
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    className="rounded-lg font-bold"
                    checked={statusFilter.includes('in-progress')}
                    onCheckedChange={(checked) => {
                      if(checked) setStatusFilter([...statusFilter, 'in-progress']);
                      else setStatusFilter(statusFilter.filter(s => s !== 'in-progress'));
                    }}
                  >
                    Active Response
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    className="rounded-lg font-bold"
                    checked={statusFilter.includes('resolved')}
                    onCheckedChange={(checked) => {
                      if(checked) setStatusFilter([...statusFilter, 'resolved']);
                      else setStatusFilter(statusFilter.filter(s => s !== 'resolved'));
                    }}
                  >
                    Resolved Nodes
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col p-4 bg-destructive/10 rounded-2xl text-center border border-destructive/10 shadow-sm">
                <span className="text-3xl font-black text-destructive leading-none">{reports.filter(r => r.status === 'open').length}</span>
                <span className="text-[10px] uppercase font-black text-destructive/60 tracking-widest mt-2">Open</span>
              </div>
              <div className="flex flex-col p-4 bg-yellow-500/10 rounded-2xl text-center border border-yellow-500/10 shadow-sm">
                <span className="text-3xl font-black text-yellow-600 leading-none">{reports.filter(r => r.status === 'in-progress').length}</span>
                <span className="text-[10px] uppercase font-black text-yellow-600/60 tracking-widest mt-2">Active</span>
              </div>
              <div className="flex flex-col p-4 bg-primary/10 rounded-2xl text-center border border-primary/10 shadow-sm">
                <span className="text-3xl font-black text-primary leading-none">{reports.filter(r => r.status === 'resolved').length}</span>
                <span className="text-[10px] uppercase font-black text-primary/60 tracking-widest mt-2">Solved</span>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-6">
              {filteredReports.length === 0 ? (
                <div className="text-center py-20 px-6">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                    <Filter className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 tracking-tight">System Clear</h3>
                  <p className="text-sm text-muted-foreground font-medium">No reports matching selected protocol.</p>
                </div>
              ) : (
                filteredReports.map(report => (
                  <div key={report.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ReportCard 
                      report={report} 
                      showActions 
                      onStatusChange={handleStatusChange}
                      onDelete={deleteReport}
                    />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative bg-muted/30">
          {/* View Toggle Controls */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex bg-card/80 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border-2 border-white/50">
             <Button 
              className={`h-11 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}
              variant="ghost" 
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="mr-2 h-4 w-4" /> Global Map
            </Button>
            <Button 
              className={`h-11 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}
              variant="ghost" 
              onClick={() => setViewMode('list')}
            >
              <List className="mr-2 h-4 w-4" /> Data Stream
            </Button>
          </div>

          <div className="h-full w-full">
            {viewMode === 'map' ? (
               <div className="h-full w-full p-6 pt-24 lg:pt-6">
                 <div className="h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-white/5">
                   <MapView reports={filteredReports} className="h-full w-full" />
                 </div>
               </div>
            ) : (
              <ScrollArea className="h-full px-8 pb-12">
                <div className="max-w-4xl mx-auto pt-32 space-y-6">
                   <div className="grid gap-6 sm:grid-cols-2">
                    {filteredReports.map(report => (
                      <div key={report.id} className="animate-in zoom-in-95 duration-300">
                        <ReportCard 
                          report={report} 
                          showActions 
                          onStatusChange={handleStatusChange}
                          onDelete={deleteReport}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
      <Chatbot />

      {/* Resolution Dialog */}
      <Dialog open={!!resolvingReportId} onOpenChange={() => setResolvingReportId(null)}>
        <DialogContent className="neo-card p-10">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Verify Cleanup</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label className="font-black text-sm uppercase tracking-widest">Post-Cleanup Evidence</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex h-60 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-4 border-foreground bg-muted hover:bg-white transition-all overflow-hidden relative"
              >
                {resolvedImage ? (
                  <img src={resolvedImage} className="h-full w-full object-cover" alt="Resolved Preview" />
                ) : (
                  <div className="flex flex-col items-center text-foreground text-center p-8">
                    <Camera className="mb-4 h-16 w-16" />
                    <span className="text-lg font-black uppercase italic tracking-wider">Tap to Upload Clean Photo</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleResolvedImageUpload} />
              </div>
            </div>
            <p className="text-sm font-bold italic opacity-60">EnvironmentTech AI will analyze this image to confirm the area is clean.</p>
          </div>
          <DialogFooter>
            <Button 
              disabled={isVerifying || !resolvedImage} 
              onClick={handleFinalizeResolution} 
              className="w-full h-16 neo-button text-xl"
            >
              {isVerifying ? "ANALYZING..." : "VERIFY & RESOLVE"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
