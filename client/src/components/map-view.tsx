import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Report, useStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useEffect } from 'react';

// Fix for default marker icon in Leaflet with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom markers based on status
const getStatusIcon = (status: Report['status']) => {
  let color = 'blue';
  if (status === 'open') color = 'red';
  if (status === 'in-progress') color = 'gold';
  if (status === 'resolved') color = 'green';

  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

interface MapViewProps {
  reports: Report[];
  center?: [number, number];
  onMarkerClick?: (report: Report) => void;
  className?: string;
  interactive?: boolean;
}

export default function MapView({ 
  reports, 
  center = [51.505, -0.09], 
  className = "h-full w-full",
  interactive = true 
}: MapViewProps) {
  
  return (
    <div className={`relative z-0 ${className}`}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={interactive}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={center} />
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.location.lat, report.location.lng]}
            icon={getStatusIcon(report.status)}
          >
            <Popup className="min-w-[200px]">
              <div className="flex flex-col gap-2">
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                  <img 
                    src={report.imageUrl} 
                    alt="Report" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={report.status === 'open' ? 'destructive' : report.status === 'resolved' ? 'default' : 'secondary'}>
                    {report.status.replace('-', ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{format(new Date(report.createdAt), 'MMM d, p')}</span>
                </div>
                <p className="text-sm font-medium leading-snug">{report.description}</p>
                <p className="text-xs text-muted-foreground">Reported by {report.userName}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
