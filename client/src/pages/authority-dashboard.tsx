import { useStore, Status } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, Filter, Map as MapIcon, List, ShieldCheck } from "lucide-react";
import ReportCard from "@/components/report-card";
import { useLocation } from "wouter";
import { useState } from "react";
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

export default function AuthorityDashboard() {
  const { user, reports, logout, updateReportStatus, deleteReport } = useStore();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [statusFilter, setStatusFilter] = useState<Status[]>(['open', 'in-progress', 'resolved']);

  if (!user || user.role !== 'authority') {
    setLocation("/");
    return null;
  }

  const filteredReports = reports.filter(r => statusFilter.includes(r.status));

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-card z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="font-display font-bold text-2xl text-primary flex items-center gap-3">
            <ShieldCheck className="h-6 w-6" />
            EcoWatch <span className="text-xs font-sans text-muted-foreground px-2 py-0.5 bg-muted rounded uppercase tracking-wider font-bold">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-bold">{user.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Environmental Officer</span>
          </div>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => { logout(); setLocation("/"); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List (Always visible on desktop) */}
        <div className="w-full max-w-sm flex-col border-r bg-muted/5 hidden md:flex">
          <div className="p-6 border-b space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold font-display text-lg">Active Reports</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 hover:bg-muted">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter.includes('open')}
                    onCheckedChange={(checked) => {
                      if(checked) setStatusFilter([...statusFilter, 'open']);
                      else setStatusFilter(statusFilter.filter(s => s !== 'open'));
                    }}
                  >
                    Open
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter.includes('in-progress')}
                    onCheckedChange={(checked) => {
                      if(checked) setStatusFilter([...statusFilter, 'in-progress']);
                      else setStatusFilter(statusFilter.filter(s => s !== 'in-progress'));
                    }}
                  >
                    In Progress
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={statusFilter.includes('resolved')}
                    onCheckedChange={(checked) => {
                      if(checked) setStatusFilter([...statusFilter, 'resolved']);
                      else setStatusFilter(statusFilter.filter(s => s !== 'resolved'));
                    }}
                  >
                    Resolved
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col p-2 bg-destructive/10 rounded-lg text-center">
                <span className="text-xl font-bold text-destructive">{reports.filter(r => r.status === 'open').length}</span>
                <span className="text-[10px] uppercase font-bold text-destructive opacity-70">Open</span>
              </div>
              <div className="flex flex-col p-2 bg-yellow-500/10 rounded-lg text-center">
                <span className="text-xl font-bold text-yellow-600">{reports.filter(r => r.status === 'in-progress').length}</span>
                <span className="text-[10px] uppercase font-bold text-yellow-600 opacity-70">Active</span>
              </div>
              <div className="flex flex-col p-2 bg-green-500/10 rounded-lg text-center">
                <span className="text-xl font-bold text-green-600">{reports.filter(r => r.status === 'resolved').length}</span>
                <span className="text-[10px] uppercase font-bold text-green-600 opacity-70">Solved</span>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4 bg-muted/20">
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">No reports match your filters.</p>
                </div>
              ) : (
                filteredReports.map(report => (
                  <ReportCard 
                    key={report.id} 
                    report={report} 
                    showActions 
                    onStatusChange={updateReportStatus}
                    onDelete={deleteReport}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Mobile View Toggle */}
          <div className="absolute top-6 right-6 z-20 md:hidden flex gap-2">
             <Button 
              className="h-12 w-12 rounded-full shadow-lg border-2"
              variant={viewMode === 'map' ? 'default' : 'secondary'} 
              size="icon" 
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="h-5 w-5" />
            </Button>
            <Button 
              className="h-12 w-12 rounded-full shadow-lg border-2"
              variant={viewMode === 'list' ? 'default' : 'secondary'} 
              size="icon" 
              onClick={() => setViewMode('list')}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>

          <div className="h-full w-full animate-in fade-in duration-500">
            {viewMode === 'map' || window.innerWidth >= 768 ? (
               <MapView reports={filteredReports} className="h-full w-full" />
            ) : (
              <ScrollArea className="h-full p-4 bg-muted/20">
                <div className="space-y-4 pt-16">
                  {filteredReports.map(report => (
                    <ReportCard 
                      key={report.id} 
                      report={report} 
                      showActions 
                      onStatusChange={updateReportStatus}
                      onDelete={deleteReport}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
