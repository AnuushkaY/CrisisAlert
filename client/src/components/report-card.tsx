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
  const statusColors = {
    'open': 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20',
    'in-progress': 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20',
    'resolved': 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20',
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-md">
      <div className="flex gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
          <img 
            src={report.imageUrl} 
            alt="Report thumbnail" 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <Badge variant="outline" className={`capitalize ${statusColors[report.status]}`}>
                {report.status.replace('-', ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(report.createdAt), 'MMM d')}
              </span>
            </div>
            <p className="font-medium line-clamp-2 text-sm">{report.description}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}</span>
            </div>
            <span>by {report.userName}</span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
          <select 
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            value={report.status}
            onChange={(e) => onStatusChange?.(report.id, e.target.value as Report['status'])}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <button 
            onClick={() => onDelete?.(report.id)}
            className="h-8 rounded-md bg-destructive px-3 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
