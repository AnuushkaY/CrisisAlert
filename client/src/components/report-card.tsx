import { Badge } from "@/components/ui/badge";
import { Report } from "@/lib/store";
import { format } from "date-fns";
import { MapPin, Clock } from "lucide-react";

interface ReportCardProps {
  report: Report;
  showActions?: boolean;
  onStatusChange?: (id: string, status: Report['status']) => void;
  onDelete?: (id: string) => void;
}

export default function ReportCard({ report, showActions, onStatusChange, onDelete }: ReportCardProps) {
  const statusConfig = {
    'open': { bg: 'bg-pink-200', text: 'text-pink-800', label: 'Open' },
    'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' },
    'resolved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Live & Clean' },
  };

  const config = statusConfig[report.status];

  return (
    <div className="neo-card p-0 overflow-hidden group">
      <div className="aspect-video w-full overflow-hidden border-b-2 border-foreground relative">
        <img 
          src={report.imageUrl} 
          alt="Report" 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute top-3 right-3 neo-badge ${config.bg} ${config.text}`}>
          {config.label}
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(new Date(report.createdAt), 'MMM d, yyyy')}
          </div>
          <span>ID: {report.id.toUpperCase()}</span>
        </div>

        <p className="font-black text-lg leading-tight line-clamp-2 uppercase italic tracking-tighter">
          "{report.description}"
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 bg-slate-100 neo-badge text-[10px]">
            <MapPin className="h-3 w-3" />
            {report.location.lat.toFixed(3)}, {report.location.lng.toFixed(3)}
          </div>
          <span className="text-xs font-bold italic">by {report.userName}</span>
        </div>

        {showActions && (
          <div className="pt-4 flex items-center gap-2 border-t-2 border-foreground/5 mt-4">
            <select 
              className="flex-1 h-10 rounded-xl border-2 border-foreground bg-white px-3 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              value={report.status}
              onChange={(e) => onStatusChange?.(report.id, e.target.value as Report['status'])}
            >
              <option value="open">Open</option>
              <option value="in-progress">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
            <button 
              onClick={() => onDelete?.(report.id)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-pink-400 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { Trash2 } from "lucide-react";
