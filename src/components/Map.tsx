import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Navigation, Info, Phone, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// Fix for default marker icon in Leaflet + React using CDN
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icon for pad locations
const padIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2859/2859706.png', // A heart or pad-like icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Location {
  id: string;
  name: string;
  address: string;
  type: 'School' | 'NGO' | 'Community Center' | 'Health Center';
  lat: number;
  lng: number;
  phone?: string;
  hours?: string;
  description: string;
}

const MOCK_LOCATIONS: Location[] = [
  {
    id: 'abuja-1',
    name: 'FCT School for the Blind',
    address: 'Jabi, Abuja',
    type: 'School',
    lat: 9.0617,
    lng: 7.4244,
    phone: '+234 800 000 0001',
    hours: '8:00 AM - 4:00 PM',
    description: 'Specialized support and free sanitary products available for students with visual impairments.'
  },
  {
    id: 'abuja-2',
    name: 'FCT School for the Deaf',
    address: 'Kuje, Abuja',
    type: 'School',
    lat: 8.8786,
    lng: 7.2276,
    phone: '+234 800 000 0002',
    hours: '8:00 AM - 4:00 PM',
    description: 'Inclusive health services and pad distribution for students with hearing impairments.'
  },
  {
    id: 'abuja-3',
    name: 'FCT School for the Handicapped',
    address: 'Kuje, Abuja',
    type: 'School',
    lat: 8.8850,
    lng: 7.2350,
    phone: '+234 800 000 0003',
    hours: '8:00 AM - 4:00 PM',
    description: 'Accessible distribution point for menstrual hygiene products.'
  },
  {
    id: 'abuja-4',
    name: 'Hope House School',
    address: 'Gwarinpa, Abuja',
    type: 'School',
    lat: 9.1089,
    lng: 7.4042,
    phone: '+234 800 000 0004',
    hours: '9:00 AM - 3:00 PM',
    description: 'Private special needs school providing hygiene support and education.'
  },
  {
    id: '1',
    name: 'Central High School',
    address: '123 Education Way, Lagos',
    type: 'School',
    lat: 6.5244,
    lng: 3.3792,
    phone: '+234 801 234 5678',
    hours: '8:00 AM - 4:00 PM',
    description: 'Free sanitary pads available in the school clinic for students and local community members.'
  },
  {
    id: '2',
    name: 'Women Health NGO',
    address: '45 Empowerment St, Ikeja',
    type: 'NGO',
    lat: 6.6018,
    lng: 3.3515,
    phone: '+234 802 345 6789',
    hours: '9:00 AM - 5:00 PM',
    description: 'Distribution point for biodegradable pads. Counseling services also available.'
  }
];

// Component to center map on selection
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, 14);
  return null;
};

const PadLocator: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([6.5244, 3.3792]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
      });
    }
  }, []);

  const filteredLocations = MOCK_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand-400">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search for locations nearby..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-brand-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
        />
      </div>

      {/* Map Container */}
      <div className="h-[300px] rounded-3xl overflow-hidden shadow-sm border border-brand-100 z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
          )}
          {filteredLocations.map(loc => (
            <Marker 
              key={loc.id} 
              position={[loc.lat, loc.lng]}
              icon={padIcon}
              eventHandlers={{
                click: () => setSelectedLocation(loc),
              }}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-brand-900">{loc.name}</p>
                  <p className="text-xs text-brand-600">{loc.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          {selectedLocation && <ChangeView center={[selectedLocation.lat, selectedLocation.lng]} />}
        </MapContainer>
      </div>

      {/* Location List / Details */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {selectedLocation ? (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setSelectedLocation(null)}
              className="mb-4 text-brand-500 text-sm font-bold flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Back to list
            </button>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-2 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold uppercase rounded-lg mb-2">
                  {selectedLocation.type}
                </span>
                <h3 className="text-xl font-bold text-brand-900">{selectedLocation.name}</h3>
                <p className="text-brand-500 text-sm flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {selectedLocation.address}
                </p>
              </div>
              <button className="p-3 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-200">
                <Navigation size={20} />
              </button>
            </div>

            <div className="space-y-4 mt-6 pt-6 border-t border-brand-50">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-brand-400 mt-1" />
                <p className="text-sm text-brand-700 leading-relaxed">
                  {selectedLocation.description}
                </p>
              </div>
              {selectedLocation.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-brand-400" />
                  <p className="text-sm text-brand-700 font-medium">{selectedLocation.phone}</p>
                </div>
              )}
              {selectedLocation.hours && (
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-brand-400" />
                  <p className="text-sm text-brand-700">{selectedLocation.hours}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          filteredLocations.map(loc => (
            <div 
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className="bg-white p-5 rounded-3xl shadow-sm border border-brand-100 flex items-center justify-between hover:border-brand-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-900">{loc.name}</h4>
                  <p className="text-xs text-brand-500">{loc.address}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-brand-300 group-hover:text-brand-500 transition-colors" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PadLocator;
