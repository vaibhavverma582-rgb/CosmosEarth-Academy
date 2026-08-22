"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  LayerGroup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { countries, Country } from "@/data/geography/countries";
import { climateZones } from "@/data/geography/climate";
import { biomes } from "@/data/geography/biomes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Globe, Thermometer, TreePine, Mountain, Eye } from "lucide-react";

// Fix Leaflet default icon issue
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

type LayerType = "satellite" | "tectonic" | "climate" | "biomes";

const layerOptions = [
  { id: "satellite" as LayerType, label: "Satellite", icon: Globe, color: "text-cosmos-cyan" },
  { id: "tectonic" as LayerType, label: "Countries", icon: Mountain, color: "text-cosmos-purple" },
  { id: "climate" as LayerType, label: "Climate", icon: Thermometer, color: "text-cosmos-orange" },
  { id: "biomes" as LayerType, label: "Biomes", icon: TreePine, color: "text-green-400" },
];

const tileLayers: Record<LayerType, { url: string; attribution: string }> = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Esri",
  },
  tectonic: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "CartoDB",
  },
  climate: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "CartoDB",
  },
  biomes: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "CartoDB",
  },
};

// Climate zone color circles
const climateCircles = climateZones.map((cz) => ({
  ...cz,
  lat: cz.slug === "tropical-rainforest" ? 0 :
       cz.slug === "tropical-savanna" ? 10 :
       cz.slug === "subtropical-desert" ? 25 :
       cz.slug === "mediterranean" ? 38 :
       cz.slug === "temperate-deciduous" ? 48 :
       cz.slug === "boreal-forest" ? 60 :
       cz.slug === "tundra" ? 72 :
       cz.slug === "ice-cap" ? 82 :
       cz.slug === "humid-subtropical" ? 30 :
       45,
  lng: cz.slug === "tropical-rainforest" ? -60 :
       cz.slug === "tropical-savanna" ? 30 :
       cz.slug === "subtropical-desert" ? 20 :
       cz.slug === "mediterranean" ? 15 :
       cz.slug === "temperate-deciduous" ? 0 :
       cz.slug === "boreal-forest" ? 90 :
       cz.slug === "tundra" ? 100 :
       cz.slug === "ice-cap" ? 0 :
       cz.slug === "humid-subtropical" ? -85 :
       60,
  radius: 25,
}));

// Biome marker positions
const biomeMarkers = [
  { ...biomes[0], lat: -3, lng: -60 },   // Tropical Rainforest
  { ...biomes[1], lat: 70, lng: 90 },    // Tundra
  { ...biomes[2], lat: -15, lng: 147 },  // Coral Reef
  { ...biomes[3], lat: 23, lng: 25 },    // Desert
  { ...biomes[4], lat: 60, lng: 90 },    // Boreal Forest
  { ...biomes[5], lat: -2, lng: 35 },    // Savanna
  { ...biomes[6], lat: 42, lng: -75 },   // Temperate Forest
  { ...biomes[7], lat: 50, lng: 10 },    // Freshwater
  { ...biomes[8], lat: 40, lng: -100 },  // Grassland
  { ...biomes[9], lat: 35, lng: -80 },   // Wetlands
];

// Custom marker icon for countries
function createCountryIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 10px ${color}66;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

// Custom marker for biomes
function createBiomeIcon(emoji: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="font-size:20px;text-shadow:0 0 8px rgba(0,0,0,0.8);">${emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

// Component to fly to location
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 4, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

interface WorldMapProps {
  flyTo?: [number, number] | null;
  showControls?: boolean;
}

export function WorldMap({ flyTo = null, showControls = true }: WorldMapProps) {
  const [activeLayer, setActiveLayer] = useState<LayerType>("satellite");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const tile = tileLayers[activeLayer];

  return (
    <div className="relative">
      {/* Layer controls */}
      {showControls && (
        <div className="absolute top-3 left-3 z-[1000] flex gap-1 rounded-lg bg-cosmos-navy/90 backdrop-blur-sm border border-white/10 p-1">
          {layerOptions.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeLayer === layer.id
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <layer.icon className={`h-3.5 w-3.5 ${activeLayer === layer.id ? layer.color : ""}`} />
              {layer.label}
            </button>
          ))}
        </div>
      )}

      {/* Map */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-white/10 sm:h-[500px] lg:h-[600px]">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url={tile.url} attribution={tile.attribution} />

          {flyTo && <FlyToLocation position={flyTo} />}

          {/* Countries layer */}
          {activeLayer === "tectonic" && (
            <LayerGroup>
              {countries.map((country) => (
                <CircleMarker
                  key={country.slug}
                  center={[country.lat, country.lng]}
                  radius={8}
                  fillColor={country.color}
                  fillOpacity={0.7}
                  color="white"
                  weight={1}
                  eventHandlers={{
                    click: () => setSelectedCountry(country),
                  }}
                >
                  <Popup>
                    <div style={{ color: "#333", fontFamily: "sans-serif" }}>
                      <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {country.flag} {country.name}
                      </p>
                      <p style={{ fontSize: "11px", color: "#666" }}>
                        {country.capital} · {country.continent}
                      </p>
                      <p style={{ fontSize: "11px", color: "#666" }}>
                        Pop: {country.population}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </LayerGroup>
          )}

          {/* Climate layer */}
          {activeLayer === "climate" && (
            <LayerGroup>
              {climateCircles.map((cz) => (
                <CircleMarker
                  key={cz.slug}
                  center={[cz.lat, cz.lng]}
                  radius={cz.radius}
                  fillColor={cz.color}
                  fillOpacity={0.3}
                  color={cz.color}
                  weight={1}
                >
                  <Popup>
                    <div style={{ color: "#333", fontFamily: "sans-serif" }}>
                      <p style={{ fontWeight: "bold", fontSize: "13px" }}>
                        {cz.name}
                      </p>
                      <p style={{ fontSize: "11px", color: "#666" }}>
                        Köppen: {cz.koppenCode}
                      </p>
                      <p style={{ fontSize: "11px", color: "#666" }}>
                        {cz.temperature}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </LayerGroup>
          )}

          {/* Biomes layer */}
          {activeLayer === "biomes" && (
            <LayerGroup>
              {biomeMarkers.map((bm) => (
                <Marker
                  key={bm.slug}
                  position={[bm.lat, bm.lng]}
                  icon={createBiomeIcon(bm.emoji)}
                >
                  <Popup>
                    <div style={{ color: "#333", fontFamily: "sans-serif" }}>
                      <p style={{ fontWeight: "bold", fontSize: "13px" }}>
                        {bm.emoji} {bm.name}
                      </p>
                      <p style={{ fontSize: "11px", color: "#666" }}>
                        {bm.area} · {bm.biodiversity} biodiversity
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          )}

          {/* Satellite layer — show countries as subtle markers */}
          {activeLayer === "satellite" && (
            <LayerGroup>
              {countries.map((country) => (
                <CircleMarker
                  key={country.slug}
                  center={[country.lat, country.lng]}
                  radius={5}
                  fillColor={country.color}
                  fillOpacity={0.5}
                  color="white"
                  weight={0.5}
                  eventHandlers={{
                    click: () => setSelectedCountry(country),
                  }}
                >
                  <Popup>
                    <div style={{ color: "#333", fontFamily: "sans-serif" }}>
                      <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {country.flag} {country.name}
                      </p>
                      <p style={{ fontSize: "11px", color: "#666" }}>
                        {country.capital}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </LayerGroup>
          )}
        </MapContainer>

        {/* Layer legend */}
        <div className="absolute bottom-3 right-3 z-[1000] rounded-lg bg-cosmos-navy/90 backdrop-blur-sm border border-white/10 px-3 py-2 text-xs text-white/50">
          {activeLayer === "satellite" && "🛰️ Satellite view — click markers for info"}
          {activeLayer === "tectonic" && "🌍 Countries — click for details"}
          {activeLayer === "climate" && "🌡️ Climate zones — hover for info"}
          {activeLayer === "biomes" && "🌿 Biomes — click for details"}
        </div>
      </div>

      {/* Selected country card */}
      {selectedCountry && (
        <div className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {selectedCountry.name}
                    </h3>
                    <p className="text-xs text-white/40">
                      {selectedCountry.capital} · {selectedCountry.continent}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/geography/countries/${selectedCountry.slug}`}
                  className="rounded-lg bg-cosmos-cyan/10 px-3 py-1.5 text-xs font-medium text-cosmos-cyan transition-colors hover:bg-cosmos-cyan/20"
                >
                  View Details →
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-white/30">Population</span>
                  <p className="font-medium text-white/60">{selectedCountry.population}</p>
                </div>
                <div>
                  <span className="text-white/30">Area</span>
                  <p className="font-medium text-white/60">{selectedCountry.area}</p>
                </div>
                <div>
                  <span className="text-white/30">Climate</span>
                  <p className="font-medium text-white/60">{selectedCountry.climate}</p>
                </div>
                <div>
                  <span className="text-white/30">Biome</span>
                  <p className="font-medium text-white/60">{selectedCountry.biome}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
