import { Badge } from "@/components/ui/badge";
import { Report, Status } from "@/lib/store";
import { format } from "date-fns";
import { MapPin, Clock, Calendar, User, Trash2, CheckCircle2, PlayCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportCardProps {
  report: Report;
  showActions?: boolean;
  onStatusChange?: (id: string, status: Status) => void;
  onDelete?: (id: string) => void;
}

export default function ReportCard({ report, showActions, onStatusChange, onDelete }: ReportCardProps) {
  const statusColors = {
    open: "bg-destructive text-white",
    "in-progress": "bg-secondary text-foreground",
    resolved: "bg-primary text-white",
  };

  const statusIcons = {
    open: <Clock className="h-4 w-4" />,
    "in-progress": <Activity className="h-4 w-4 animate-pulse" />,
    resolved: <CheckCircle2 className="h-4 w-4" />,
  };

  return (
    <div className="group relative">
      {/* Neo-Brutalist Sticker Effect */}
      <div className="absolute inset-0 bg-foreground rounded-[2.5rem] translate-x-3 translate-y-3 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform duration-300" />
      
      <div className="relative bg-white border-4 border-foreground rounded-[2.5rem] overflow-hidden flex flex-col h-full transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
        
        {/* Visual Hero - The Image is everything */}
        <div className="relative h-64 w-full overflow-hidden bg-muted group-hover:bg-muted/80">
          <img 
            src={report.imageUrl} 
            alt={report.description}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Status Badge Over Image */}
          <div className="absolute top-6 left-6">
             <div className={`neo-badge ${statusColors[report.status]} flex items-center gap-2 px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                {statusIcons[report.status]}
                <span className="text-xs font-black uppercase tracking-widest">{report.status}</span>
             </div>
          </div>

          {/* Location Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
             <div className="bg-white/90 backdrop-blur-md border-4 border-foreground rounded-2xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-primary p-2 border-2 border-foreground rounded-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-tighter opacity-60 leading-none">Sector Coordinates</div>
                  <div className="text-xs font-black italic">{report.location.lat.toFixed(3)}, {report.location.lng.toFixed(3)}</div>
                </div>
             </div>
          </div>
        </div>

        {/* Info Block */}
        <div className="p-8 flex-1 flex flex-col space-y-6">
          <div className="space-y-3">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-muted px-3 py-1.5 rounded-full border-2 border-foreground/10">
                   <Calendar className="h-3 w-3 text-accent" />
                   {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-muted px-3 py-1.5 rounded-full border-2 border-foreground/10">
                   <User className="h-3 w-3 text-secondary" />
                   {report.userName}
                </div>
             </div>
             <h3 className="font-display font-black text-2xl uppercase italic leading-[1.1] tracking-tighter line-clamp-2">
               "{report.description}"
             </h3>
          </div>

          {showActions && (
            <div className="pt-6 mt-auto border-t-4 border-foreground/5 flex items-center gap-4">
              <div className="relative flex-1">
                <select 
                  className="w-full h-14 bg-white border-4 border-foreground rounded-2xl font-black text-xs uppercase px-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] appearance-none cursor-pointer hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  value={report.status}
                  onChange={(e) => onStatusChange?.(report.id, e.target.value as Status)}
                >
                  <option value="open">Open Incident</option>
                  <option value="in-progress">Active Response</option>
                  <option value="resolved">Clear Site</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <PlayCircle className="h-5 w-5 opacity-40" />
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-14 w-14 border-4 border-foreground rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all shrink-0"
                onClick={() => onDelete?.(report.id)}
              >
                <Trash2 className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
