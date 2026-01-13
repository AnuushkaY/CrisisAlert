import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Incident, Resource, Alert, useStore } from '@/lib/store';
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

// Custom markers based on type
const getIncidentIcon = (severity: Incident['severity']) => {
  let color = 'blue';
  if (severity === 'low') color = 'blue';
  if (severity === 'medium') color = 'orange';
  if (severity === 'high') color = 'red';
  if (severity === 'critical') color = 'black';

  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const getResourceIcon = (type: Resource['type']) => {
  let color = 'green';
  if (type === 'personnel') color = 'blue';
  if (type === 'vehicle') color = 'orange';
  if (type === 'equipment') color = 'purple';
  if (type === 'supplies') color = 'green';

  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const getAlertIcon = () => {
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png`,
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
  incidents?: Incident[];
  resources?: Resource[];
  alerts?: Alert[];
  center?: [number, number];
  onMarkerClick?: (item: Incident | Resource | Alert) => void;
  className?: string;
  interactive?: boolean;
}

export default function MapView({
  incidents = [],
  resources = [],
  alerts = [],
  center = [40.7128, -74.0060],
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

        {/* Incident Markers */}
        {incidents.map((incident) => (
          <Marker
            key={`incident-${incident.id}`}
            position={[incident.location.lat, incident.location.lng]}
            icon={getIncidentIcon(incident.severity)}
          >
            <Popup className="min-w-[250px]">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg">{incident.title}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant={incident.severity === 'critical' ? 'destructive' : incident.severity === 'high' ? 'default' : 'secondary'}>
                    {incident.severity} priority
                  </Badge>
                  <Badge variant="outline">{incident.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={incident.status === 'resolved' ? 'default' : 'destructive'}>
                    {incident.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{format(new Date(incident.createdAt), 'MMM d, p')}</span>
                </div>
                <p className="text-sm font-medium leading-snug">{incident.description}</p>
                {incident.location.address && (
                  <p className="text-xs text-muted-foreground">📍 {incident.location.address}</p>
                )}
                {incident.images && incident.images.length > 0 && (
                  <div className="mt-2 flex gap-1 overflow-x-auto">
                    {incident.images.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        className="h-12 w-12 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Resource Markers */}
        {resources.map((resource) => (
          <Marker
            key={`resource-${resource.id}`}
            position={[resource.location?.lat || 40.7128, resource.location?.lng || -74.0060]}
            icon={getResourceIcon(resource.type)}
          >
            <Popup className="min-w-[200px]">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg">{resource.name}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{resource.type}</Badge>
                  <Badge variant={resource.status === 'available' ? 'default' : 'secondary'}>
                    {resource.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{resource.organization}</p>
                <div className="text-sm">
                  <span className="font-medium">Available: </span>
                  {resource.available}/{resource.quantity}
                </div>
                {resource.description && (
                  <p className="text-sm">{resource.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Alert Markers */}
        {alerts.map((alert) => (
          <Marker
            key={`alert-${alert.id}`}
            position={[alert.location?.lat || 40.7128, alert.location?.lng || -74.0060]}
            icon={getAlertIcon()}
          >
            <Popup className="min-w-[200px]">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg text-red-600">{alert.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.priority === 'critical' ? 'destructive' : 'default'}>
                    {alert.priority}
                  </Badge>
                  <Badge variant="outline">{alert.type}</Badge>
                </div>
                <p className="text-sm font-medium leading-snug">{alert.message}</p>
                <span className="text-xs text-muted-foreground">{format(new Date(alert.createdAt), 'MMM d, p')}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
