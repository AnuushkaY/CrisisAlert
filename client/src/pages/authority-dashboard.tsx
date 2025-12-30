import { useStore, Status } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, Filter, Map as MapIcon, List } from "lucide-react";
import ReportCard from "@/components/report-card";
import { useLocation } from "wouter";
import { useState } from "react";
import MapView from "@/components/map-view";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6 bg-card z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="font-display font-bold text-xl text-primary">EcoWatch <span className="text-muted-foreground font-sans text-sm font-normal ml-2">Authority Portal</span></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium mr-2 hidden sm:inline-block">{user.name}</span>
          <Button variant="ghost" size="icon" onClick={() => { logout(); setLocation("/"); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List (Always visible on desktop, toggle on mobile usually but keeping simple here) */}
        <div className="w-full max-w-sm flex-col border-r bg-muted/10 hidden md:flex">
          <div className="p-4 border-b space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Reports ({filteredReports.length})</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Filter className="mr-2 h-3 w-3" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
            
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-0">
                {reports.filter(r => r.status === 'open').length} Open
              </Badge>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-0">
                {reports.filter(r => r.status === 'in-progress').length} In Progress
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-0">
                {reports.filter(r => r.status === 'resolved').length} Resolved
              </Badge>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
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
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Mobile View Toggle */}
          <div className="absolute top-4 right-4 z-10 md:hidden bg-background rounded-lg shadow border p-1 flex">
             <Button 
              variant={viewMode === 'map' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {viewMode === 'map' || window.innerWidth >= 768 ? (
             <MapView reports={filteredReports} />
          ) : (
            <ScrollArea className="h-full p-4">
              <div className="space-y-4 pt-10">
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
  );
}
