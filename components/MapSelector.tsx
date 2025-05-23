"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Circle,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const cityCoordinates: Record<string, [number, number]> = {
  Cochabamba: [-17.3926148, -66.1588057],
  "Santa Cruz": [-17.7833, -63.1821],
  "La paz/El Alto": [-16.5, -68.15],
  Potosi: [-19.5836, -65.7531],
  Sucre: [-19.0333, -65.2627],
  Oruro: [-17.9833, -67.15],
};

// Calcula la distancia entre dos puntos geográficos en km usando la fórmula de Haversine
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;

  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

export default function MapSelector({
  onLocationSelect,
}: {
  onLocationSelect: (latlng: { lat: number; lng: number }) => void;
}) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -17.3935, -66.157,
  ]); // Default Cochabamba
  const [ciudad, setCiudad] = useState<string>("Cochabamba");

  useEffect(() => {
    const ciudadSeleccionada = localStorage.getItem("ciudadSeleccionada");
    if (ciudadSeleccionada && cityCoordinates[ciudadSeleccionada]) {
      setMapCenter(cityCoordinates[ciudadSeleccionada]);
      setCiudad(ciudadSeleccionada);
    }
  }, []);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const latlng = e.latlng;
        const centro = cityCoordinates[ciudad];
        if (!centro) return;

        const distancia = haversineDistance(
          latlng.lat,
          latlng.lng,
          centro[0],
          centro[1],
        );

        if (distancia > 15) {
          alert(
            "No puedes seleccionar una ubicación fuera del radio de 15 km del departamento.",
          );
          return;
        }

        setPosition(latlng);
        onLocationSelect(latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={markerIcon} />
    );
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "300px", width: "100%" }}
      className="rounded-lg overflow-hidden z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <RecenterMap center={mapCenter} />
      <Circle
        center={mapCenter}
        radius={15000} // 25 km en metros
        pathOptions={{
          color: "#999999",
          fillColor: "#cccccc",
          fillOpacity: 0.2,
        }} // color plomo
      />
      <LocationMarker />
    </MapContainer>
  );
}
