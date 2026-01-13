import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, Map as MapIcon, List, AlertTriangle, Users, BarChart3, Settings, Bell, Trash2 } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function CoordinatorDashboard() {
  const { user, incidents, resources, alerts, logout, updateIncident, addAlert, addResource, deleteResource } = useStore();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'resources'>('map');
  const [statusFilter, setStatusFilter] = useState<string[]>(['reported', 'acknowledged', 'in-progress']);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    type: 'warning' as const,
    priority: 'medium' as const,
  });

  const [newResource, setNewResource] = useState({
    name: '',
    type: 'personnel' as const,
    category: '',
    quantity: 1,
    available: 1,
    organization: '',
    description: '',
  });

  if (!user || user.role !== 'coordinator') {
    setLocation("/");
    return null;
  }

  const handleStatusChange = (id: string, status: string) => {
    updateIncident(id, { status: status as any });
    toast({
      title: "Status Updated",
      description: `Incident status changed to ${status}`,
    });
  };

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addAlert({
      ...newAlert,
      targetUsers: ['citizen', 'agency'],
      createdBy: user.id,
    });

    setNewAlert({
      title: '',
      message: '',
      type: 'warning',
      priority: 'medium',
    });
    setIsAlertDialogOpen(false);
    toast({
      title: "Alert Created",
      description: "Emergency alert has been broadcast to all users",
    });
  };

  const handleCreateResource = () => {
    if (!newResource.name || !newResource.organization) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addResource({
      ...newResource,
      status: 'available',
      location: { lat: 40.7128, lng: -74.0060 }, // Default location
    });

    setNewResource({
      name: '',
      type: 'personnel',
      category: '',
      quantity: 1,
      available: 1,
      organization: '',
      description: '',
    });
    setIsResourceDialogOpen(false);
    toast({
      title: "Resource Added",
      description: "New resource has been added to the system",
    });
  };

  const filteredIncidents = incidents
    .filter(i => statusFilter.includes(i.status))
    .sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const stats = {
    totalIncidents: incidents.length,
    activeIncidents: incidents.filter((i: any) => i.status !== 'resolved').length,
    resolvedIncidents: incidents.filter((i: any) => i.status === 'resolved').length,
    availableResources: resources.filter((r: any) => r.status === 'available').length,
  };

  // Analytics data
  const incidentByCategory = incidents.reduce((acc, incident: any) => {
    acc[incident.category] = (acc[incident.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(incidentByCategory).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
  }));

  const statusData = [
    { name: 'Reported', value: incidents.filter((i: any) => i.status === 'reported').length, color: '#ef4444' },
    { name: 'Acknowledged', value: incidents.filter((i: any) => i.status === 'acknowledged').length, color: '#f97316' },
    { name: 'In Progress', value: incidents.filter((i: any) => i.status === 'in-progress').length, color: '#eab308' },
    { name: 'Resolved', value: incidents.filter((i: any) => i.status === 'resolved').length, color: '#22c55e' },
  ];

  const priorityData = [
    { name: 'Critical', value: incidents.filter((i: any) => i.priority === 'critical').length, color: '#dc2626' },
    { name: 'High', value: incidents.filter((i: any) => i.priority === 'high').length, color: '#ea580c' },
    { name: 'Medium', value: incidents.filter((i: any) => i.priority === 'medium').length, color: '#ca8a04' },
    { name: 'Low', value: incidents.filter((i: any) => i.priority === 'low').length, color: '#16a34a' },
  ];

  const responseTimeData = [
    { time: '0-15min', incidents: 12 },
    { time: '15-30min', incidents: 8 },
    { time: '30-60min', incidents: 15 },
    { time: '1-2hrs', incidents: 6 },
    { time: '2-4hrs', incidents: 3 },
    { time: '4hrs+', incidents: 1 },
  ];

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <header className="flex h-20 shrink-0 items-center justify-between border-b px-8 bg-card/50 backdrop-blur-xl z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="font-display font-extrabold text-3xl text-primary tracking-tighter flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            CrisisAlert
            <span className="text-[10px] font-sans text-white px-2.5 py-1 bg-green-500 rounded-full uppercase tracking-[0.2em] font-black shadow-lg">COORD</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-black uppercase tracking-tight">{user.name}</span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-[0.15em] opacity-80">Emergency Coordinator</span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 border hover:bg-blue-500/10 hover:text-blue-500 transition-all relative">
                <Bell className="h-5 w-5" />
                {alerts.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    {alerts.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-black text-lg">Recent Alerts & Notifications</h3>
              </div>
              <ScrollArea className="h-80">
                <div className="p-2">
                  {alerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No active alerts</p>
                    </div>
                  ) : (
                    alerts.slice(0, 5).map((alert: any) => (
                      <div key={alert.id} className="p-3 border-b last:border-b-0 hover:bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            alert.priority === 'critical' ? 'bg-red-500' :
                            alert.priority === 'high' ? 'bg-orange-500' :
                            alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-bold text-sm">{alert.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(alert.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 border hover:bg-destructive/10 hover:text-destructive transition-all" onClick={() => { logout(); setLocation("/"); }}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full max-w-md flex-col border-r bg-muted/20 hidden lg:flex shadow-2xl z-20">
          <div className="p-8 border-b space-y-8 bg-card/30">
            <div className="flex items-center justify-between">
              <h2 className="font-black font-display text-2xl tracking-tight">Crisis Overview</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 font-bold border-2">
                    <Settings className="mr-2 h-4 w-4" /> Filter
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
              <div className="flex flex-col p-4 bg-red-500/10 rounded-2xl text-center border border-red-500/10 shadow-sm">
                <span className="text-3xl font-black text-red-600 leading-none">{stats.activeIncidents}</span>
                <span className="text-[10px] uppercase font-black text-red-600/60 tracking-widest mt-2">Active</span>
              </div>
              <div className="flex flex-col p-4 bg-green-500/10 rounded-2xl text-center border border-green-500/10 shadow-sm">
                <span className="text-3xl font-black text-green-600 leading-none">{stats.availableResources}</span>
                <span className="text-[10px] uppercase font-black text-green-600/60 tracking-widest mt-2">Resources</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full neo-button bg-blue-500 hover:bg-blue-600"
                onClick={() => window.open('https://ndmindia.mha.gov.in/ndmi/contact-us')}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Contact Emergency Services
              </Button>

              <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full neo-button bg-red-500 hover:bg-red-600">
                    <Bell className="mr-2 h-4 w-4" />
                    Create Alert
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-4 border-foreground rounded-[1.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="pb-6">
                    <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Create Emergency Alert</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Alert Title</Label>
                      <Input
                        placeholder="e.g., EVACUATE IMMEDIATELY"
                        className="rounded-2xl border-4 border-foreground font-black text-lg p-6"
                        value={newAlert.title}
                        onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Alert Message</Label>
                      <Textarea
                        placeholder="Detailed emergency information..."
                        className="rounded-2xl border-4 border-foreground font-black text-lg p-6 min-h-[120px]"
                        value={newAlert.message}
                        onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label className="font-black text-sm uppercase tracking-widest">Type</Label>
                        <Select value={newAlert.type} onValueChange={(value: any) => setNewAlert(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger className="rounded-2xl border-4 border-foreground font-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label className="font-black text-sm uppercase tracking-widest">Priority</Label>
                        <Select value={newAlert.priority} onValueChange={(value: any) => setNewAlert(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger className="rounded-2xl border-4 border-foreground font-black">
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
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateAlert} className="w-full h-16 neo-button text-xl bg-red-500 hover:bg-red-600">
                      BROADCAST ALERT
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full neo-card">
                    <Users className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-4 border-foreground rounded-[1.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="pb-6">
                    <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Add Emergency Resource</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Resource Name</Label>
                      <Input
                        placeholder="e.g., Medical Team Alpha"
                        className="rounded-2xl border-4 border-foreground font-black text-lg p-6"
                        value={newResource.name}
                        onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label className="font-black text-sm uppercase tracking-widest">Type</Label>
                        <Select value={newResource.type} onValueChange={(value: any) => setNewResource(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger className="rounded-2xl border-4 border-foreground font-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personnel">Personnel</SelectItem>
                            <SelectItem value="vehicle">Vehicle</SelectItem>
                            <SelectItem value="equipment">Equipment</SelectItem>
                            <SelectItem value="supplies">Supplies</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label className="font-black text-sm uppercase tracking-widest">Category</Label>
                        <Input
                          placeholder="e.g., Medical, Firefighting"
                          className="rounded-2xl border-4 border-foreground font-black text-lg p-6"
                          value={newResource.category}
                          onChange={(e) => setNewResource(prev => ({ ...prev, category: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label className="font-black text-sm uppercase tracking-widest">Total Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          className="rounded-2xl border-4 border-foreground font-black text-lg p-6"
                          value={newResource.quantity}
                          onChange={(e) => setNewResource(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label className="font-black text-sm uppercase tracking-widest">Available</Label>
                        <Input
                          type="number"
                          min="0"
                          className="rounded-2xl border-4 border-foreground font-black text-lg p-6"
                          value={newResource.available}
                          onChange={(e) => setNewResource(prev => ({ ...prev, available: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Organization</Label>
                      <Select value={newResource.organization} onValueChange={(value) => setNewResource(prev => ({ ...prev, organization: value }))}>
                        <SelectTrigger className="rounded-2xl border-4 border-foreground font-black text-lg p-6">
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fire Department">Fire Department</SelectItem>
                          <SelectItem value="Emergency Medical Services">Emergency Medical Services</SelectItem>
                          <SelectItem value="Police Department">Police Department</SelectItem>
                          <SelectItem value="City Emergency Services">City Emergency Services</SelectItem>
                          <SelectItem value="Search and Rescue">Search and Rescue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label className="font-black text-sm uppercase tracking-widest">Description</Label>
                      <Textarea
                        placeholder="Resource details and capabilities..."
                        className="rounded-2xl border-4 border-foreground font-black text-lg p-6 min-h-[80px]"
                        value={newResource.description}
                        onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateResource} className="w-full h-16 neo-button text-xl">
                      ADD RESOURCE
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-6">
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-20 px-6">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 tracking-tight">All Clear</h3>
                  <p className="text-sm text-muted-foreground font-medium">No incidents matching current filters.</p>
                </div>
              ) : (
                incidents.sort((a: any, b: any) => {
                  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
                }).map((incident: any) => (
                  <Card key={incident.id} className="neo-card p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-black text-lg">{incident.title}</h3>
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
                            <SelectItem value="reported">Reported</SelectItem>
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
                    </div>
                  </Card>
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
              <MapIcon className="mr-2 h-4 w-4" /> Crisis Map
            </Button>
            <Button
              className={`h-11 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}
              variant="ghost"
              onClick={() => setViewMode('list')}
            >
              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
            </Button>
            <Button
              className={`h-11 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'resources' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}
              variant="ghost"
              onClick={() => setViewMode('resources')}
            >
              <Users className="mr-2 h-4 w-4" /> Resources
            </Button>
          </div>

          <div className="h-full w-full">
            {viewMode === 'map' ? (
               <div className="h-full w-full p-6 pt-24 lg:pt-6">
                 <div className="h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-white/5">
                   <MapView incidents={incidents.sort((a: any, b: any) => {
                     const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                     return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
                   })} resources={resources} alerts={alerts} />
                 </div>
               </div>
            ) : viewMode === 'resources' ? (
              <ScrollArea className="h-full px-8 pb-12">
                <div className="max-w-6xl mx-auto pt-32 space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Emergency Resources</h2>
                    <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="neo-button bg-green-500 hover:bg-green-600">
                          <Users className="mr-2 h-4 w-4" />
                          Add Resource
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white border-4 border-foreground rounded-[1.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="pb-6">
                          <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Add Emergency Resource</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                          <div className="grid gap-3">
                            <Label className="font-black text-sm uppercase tracking-widest">Resource Name</Label>
                            <Input
                              placeholder="e.g., Medical Team Alpha"
                              className="rounded-2xl border-4 border-foreground font-black text-lg p-6"
                              value={newResource.name}
                              onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-3">
                              <Label className="font-black text-sm uppercase tracking-widest">Type</Label>
                              <Select value={newResource.type} onValueChange={(value: any) => setNewResource(prev => ({ ...prev, type: value }))}>
                                <SelectTrigger className="rounded-2xl border-4 border-foreground font-black">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="personnel">Personnel</SelectItem>
                                  <SelectItem value="vehicle">Vehicle</SelectItem>
                                  <SelectItem value="equipment">Equipment</SelectItem>
                                  <SelectItem value="supplies">Supplies</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-3">
                              <Label className="font-black text-sm uppercase tracking-widest">Category</Label>
                              <Input
                                placeholder="e.g., Medical, Firefighting"
                                className="rounded-2xl border-4 border-foreground font-black text-lg p-6"
                                value={newResource.category}
                                onChange={(e) => setNewResource(prev => ({ ...prev, category: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-3">
                              <Label className="font-black text-sm uppercase tracking-widest">Total Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                className="rounded-2xl border-4 border-foreground font-black text-lg p-6"
                                value={newResource.quantity}
                                onChange={(e) => setNewResource(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label className="font-black text-sm uppercase tracking-widest">Available</Label>
                              <Input
                                type="number"
                                min="0"
                                className="rounded-2xl border-4 border-foreground font-black text-lg p-6"
                                value={newResource.available}
                                onChange={(e) => setNewResource(prev => ({ ...prev, available: parseInt(e.target.value) || 0 }))}
                              />
                            </div>
                          </div>
                          <div className="grid gap-3">
                            <Label className="font-black text-sm uppercase tracking-widest">Organization</Label>
                            <Select value={newResource.organization} onValueChange={(value) => setNewResource(prev => ({ ...prev, organization: value }))}>
                              <SelectTrigger className="rounded-2xl border-4 border-foreground font-black text-lg p-6">
                                <SelectValue placeholder="Select organization" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Fire Department">Fire Department</SelectItem>
                                <SelectItem value="Emergency Medical Services">Emergency Medical Services</SelectItem>
                                <SelectItem value="Police Department">Police Department</SelectItem>
                                <SelectItem value="City Emergency Services">City Emergency Services</SelectItem>
                                <SelectItem value="Search and Rescue">Search and Rescue</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-3">
                            <Label className="font-black text-sm uppercase tracking-widest">Description</Label>
                            <Textarea
                              placeholder="Resource details and capabilities..."
                              className="rounded-2xl border-4 border-foreground font-black text-lg p-6 min-h-[80px]"
                              value={newResource.description}
                              onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleCreateResource} className="w-full h-16 neo-button text-xl">
                            ADD RESOURCE
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                      <Card key={resource.id} className="neo-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg font-black">{resource.name}</CardTitle>
                              <Badge variant="outline" className="mt-2">{resource.type}</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${resource.name}"?`)) {
                                  deleteResource(resource.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Available:</span>
                              <span className="font-bold">{resource.available}/{resource.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant={resource.status === 'available' ? 'default' : 'secondary'}>
                                {resource.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Organization:</span>
                              <span className="font-bold text-xs">{resource.organization}</span>
                            </div>
                            {resource.description && (
                              <p className="text-sm text-muted-foreground mt-3">{resource.description}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {resources.length === 0 && (
                    <div className="text-center py-20">
                      <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="font-bold text-lg mb-2">No Resources</h3>
                      <p className="text-muted-foreground">Add emergency resources to manage crisis response.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <ScrollArea className="h-full px-8 pb-12">
                <div className="max-w-6xl mx-auto pt-32 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="neo-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Total Incidents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-black">{stats.totalIncidents}</div>
                      </CardContent>
                    </Card>
                    <Card className="neo-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Active Incidents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-black text-red-600">{stats.activeIncidents}</div>
                      </CardContent>
                    </Card>
                    <Card className="neo-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Resolved</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-black text-green-600">{stats.resolvedIncidents}</div>
                      </CardContent>
                    </Card>
                    <Card className="neo-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Available Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-black text-blue-600">{stats.availableResources}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="neo-card">
                      <CardHeader>
                        <CardTitle className="font-black text-lg">Incidents by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="neo-card">
                      <CardHeader>
                        <CardTitle className="font-black text-lg">Incident Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={statusData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8">
                              {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="neo-card">
                      <CardHeader>
                        <CardTitle className="font-black text-lg">Priority Levels</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={priorityData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#82ca9d">
                              {priorityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="neo-card">
                      <CardHeader>
                        <CardTitle className="font-black text-lg">Response Time Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={responseTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="incidents" stroke="#8884d8" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}