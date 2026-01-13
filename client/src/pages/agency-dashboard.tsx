import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, Map as MapIcon, List, Truck, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import MapView from "@/components/map-view";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AgencyDashboard() {
  const { user, incidents, resources, alerts, logout, updateIncident, allocateResource } = useStore();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [statusFilter, setStatusFilter] = useState<string[]>(['reported', 'acknowledged', 'in-progress']);
  const { toast } = useToast();

  if (!user || user.role !== 'agency') {
    setLocation("/");
    return null;
  }

  // Filter incidents assigned to this agency or that match agency's organization
  const agencyIncidents = incidents.filter(i =>
    i.assignedTo === user.id ||
    (user.organization && i.assignedTo && resources.find(r => r.id === i.assignedTo)?.organization === user.organization)
  );

  const availableIncidents = incidents.filter(i =>
    (i.status === 'reported' || i.status === 'acknowledged') && i.assignedTo !== user.id
  );

  const agencyResources = resources.filter(r => r.organization === user.organization);

  const handleStatusChange = (id: string, status: string) => {
    updateIncident(id, {
      status: status as any,
      assignedTo: user.id // Ensure incident stays assigned to current user
    });
    toast({
      title: "Status Updated",
      description: `Incident status changed to ${status}`,
    });
  };

  const handleAssignIncident = (incidentId: string) => {
    updateIncident(incidentId, {
      status: 'acknowledged',
      assignedTo: user.id
    });
    toast({
      title: "Incident Assigned",
      description: "You have been assigned to this incident",
    });
  };

  const handleAllocateResource = (resourceId: string, incidentId: string, quantity: number) => {
    allocateResource({
      resourceId,
      incidentId,
      quantity,
      allocatedBy: user.id,
      status: 'allocated'
    });
    toast({
      title: "Resource Allocated",
      description: "Resource has been deployed to the incident",
    });
  };

  const filteredIncidents = agencyIncidents.filter(i => statusFilter.includes(i.status));

  const stats = {
    assignedIncidents: agencyIncidents.filter(i => i.status !== 'resolved').length,
    availableResources: agencyResources.filter(r => r.status === 'available').length,
    deployedResources: agencyResources.filter(r => r.status === 'deployed').length,
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <header className="flex h-20 shrink-0 items-center justify-between border-b px-8 bg-card/50 backdrop-blur-xl z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="font-display font-extrabold text-3xl text-red-600 tracking-tighter flex items-center gap-3">
            <Truck className="h-8 w-8" />
            CrisisAlert
            <span className="text-[10px] font-sans text-white px-2.5 py-1 bg-red-500 rounded-full uppercase tracking-[0.2em] font-black shadow-lg">AGENCY</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-black uppercase tracking-tight">{user.name}</span>
            <span className="text-[10px] text-red-600 font-bold uppercase tracking-[0.15em] opacity-80">{user.organization}</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 border hover:bg-destructive/10 hover:text-destructive transition-all" onClick={() => { logout(); setLocation("/"); }}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full max-w-md border-r bg-muted/20 hidden lg:flex shadow-2xl z-20">
          <ScrollArea className="flex-1">
            <div className="p-8 border-b space-y-8 bg-card/30">
            <div className="flex items-center justify-between">
              <h2 className="font-black font-display text-2xl tracking-tight">Agency Operations</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 font-bold border-2">
                    <AlertTriangle className="mr-2 h-4 w-4" /> Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-2">
                  <DropdownMenuCheckboxItem
                    className="rounded-lg font-bold"
                    checked={statusFilter.includes('reported')}
                    onCheckedChange={(checked) => {
                      if(checked) setStatusFilter([...statusFilter, 'reported']);
                      else setStatusFilter(statusFilter.filter(s => s !== 'reported'));
                    }}
                  >
                    Reported
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    className="rounded-lg font-bold"
                    checked={statusFilter.includes('acknowledged')}
                    onCheckedChange={(checked) => {
                      if(checked) setStatusFilter([...statusFilter, 'acknowledged']);
                      else setStatusFilter(statusFilter.filter(s => s !== 'acknowledged'));
                    }}
                  >
                    Acknowledged
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    className="rounded-lg font-bold"
                    checked={statusFilter.includes('in-progress')}
                    onCheckedChange={(checked) => {
                      if(checked) setStatusFilter([...statusFilter, 'in-progress']);
                      else setStatusFilter(statusFilter.filter(s => s !== 'in-progress'));
                    }}
                  >
                    In Progress
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    className="rounded-lg font-bold"
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

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col p-4 bg-blue-500/10 rounded-2xl text-center border border-blue-500/10 shadow-sm">
                <span className="text-3xl font-black text-blue-600 leading-none">{stats.assignedIncidents}</span>
                <span className="text-[10px] uppercase font-black text-blue-600/60 tracking-widest mt-2">Assigned</span>
              </div>
              <div className="flex flex-col p-4 bg-green-500/10 rounded-2xl text-center border border-green-500/10 shadow-sm">
                <span className="text-3xl font-black text-green-600 leading-none">{stats.availableResources}</span>
                <span className="text-[10px] uppercase font-black text-green-600/60 tracking-widest mt-2">Available</span>
              </div>
            </div>

            {/* Action Buttons */}
            {/* Agencies focus on responding to incidents, not creating them */}

            {/* Available Incidents */}
            <div className="space-y-4">
              <h3 className="font-black text-lg uppercase tracking-widest">Available Incidents</h3>
              {availableIncidents.length === 0 ? (
                <div className="text-center py-10 px-6 bg-muted/20 rounded-2xl">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground font-medium">No available incidents at this time.</p>
                </div>
              ) : (
                availableIncidents.slice(0, 3).map(incident => (
                  <Card key={incident.id} className="neo-card p-6 border-l-8 border-l-yellow-500">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-black text-lg">{incident.title}</h4>
                          <div className="flex gap-2">
                            <Badge variant={incident.severity === 'critical' ? 'destructive' : incident.severity === 'high' ? 'default' : 'secondary'}>
                              {incident.severity}
                            </Badge>
                            <Badge variant="outline">{incident.category}</Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAssignIncident(incident.id)}
                          className="neo-button bg-blue-500 hover:bg-blue-600"
                        >
                          Assign
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="text-xs text-muted-foreground">
                        {new Date(incident.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* My Assignments */}
            <div className="space-y-4">
              <h3 className="font-black text-lg uppercase tracking-widest">My Assignments</h3>
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-10 px-6 bg-muted/20 rounded-2xl">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground font-medium">No assigned incidents.</p>
                </div>
              ) : (
                filteredIncidents.map(incident => (
                  <Card key={incident.id} className="neo-card p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-black text-lg">{incident.title}</h4>
                          <div className="flex gap-2">
                            <Badge variant={incident.severity === 'critical' ? 'destructive' : incident.severity === 'high' ? 'default' : 'secondary'}>
                              {incident.severity}
                            </Badge>
                            <Badge variant="outline">{incident.category}</Badge>
                          </div>
                        </div>
                        <Select value={incident.status} onValueChange={(value) => handleStatusChange(incident.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acknowledged">Acknowledged</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="text-xs text-muted-foreground">
                        {new Date(incident.createdAt).toLocaleString()}
                      </div>

                      {/* Resource Allocation */}
                      {agencyResources.length > 0 && (
                        <div className="space-y-2">
                          <Label className="font-black text-sm uppercase tracking-widest">Deploy Resources</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {agencyResources.filter(r => r.status === 'available').map(resource => (
                              <div key={resource.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                                <div>
                                  <span className="font-bold text-sm">{resource.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">({resource.available}/{resource.quantity})</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAllocateResource(resource.id, incident.id, 1)}
                                  disabled={resource.available === 0}
                                >
                                  Deploy
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative bg-muted/30">
          {/* View Toggle Controls */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex bg-card/80 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border-2 border-white/50">
             <Button
              className={`h-11 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}
              variant="ghost"
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="mr-2 h-4 w-4" /> Response Map
            </Button>
            <Button
              className={`h-11 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}
              variant="ghost"
              onClick={() => setViewMode('list')}
            >
              <Users className="mr-2 h-4 w-4" /> Resources
            </Button>
          </div>

          <div className="h-full w-full">
            {viewMode === 'map' ? (
               <div className="h-full w-full p-6 pt-24 lg:pt-6">
                 <div className="h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-white/5">
                   <MapView incidents={filteredIncidents} resources={agencyResources} alerts={alerts} />
                 </div>
               </div>
            ) : (
              <ScrollArea className="h-full px-8 pb-12">
                <div className="max-w-6xl mx-auto pt-32 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agencyResources.map(resource => (
                      <Card key={resource.id} className={`neo-card ${resource.status === 'deployed' ? 'border-red-500' : 'border-green-500'}`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-black">{resource.name}</CardTitle>
                          <Badge variant={resource.status === 'available' ? 'default' : 'destructive'}>
                            {resource.status}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Available:</span>
                              <span className="font-bold">{resource.available}/{resource.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Type:</span>
                              <span className="font-bold">{resource.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Category:</span>
                              <span className="font-bold">{resource.category}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {agencyResources.length === 0 && (
                    <Card className="neo-card">
                      <CardContent className="text-center py-20">
                        <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No resources assigned to your agency.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}