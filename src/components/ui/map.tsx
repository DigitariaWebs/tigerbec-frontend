"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { MapPin } from "lucide-react";

interface MapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  markerTitle?: string;
  markerDescription?: string;
}

export function Map({
  center = [-73.5698, 45.5236], // Montreal coordinates
  zoom = 14,
  className = "",
  markerTitle = "Tiger Be Cars",
  markerDescription = "11760 5e Avenue, Montréal",
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const { theme, systemTheme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: getMapStyle(currentTheme),
      center: center,
      zoom: zoom,
      attributionControl: false,
    });

    // Add navigation controls
    const nav = new maplibregl.NavigationControl({
      visualizePitch: true,
    });
    map.current.addControl(nav, "top-right");

    // Add fullscreen control
    map.current.addControl(new maplibregl.FullscreenControl(), "top-right");

    // Add geolocate control
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.current.addControl(geolocate, "top-right");

    // Create custom marker element
    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.innerHTML = `
      <div style="
        position: relative;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Pulsing circle -->
        <div style="
          position: absolute;
          width: 48px;
          height: 48px;
          background: oklch(0.72 0.17 66.8);
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          opacity: 0.3;
        "></div>
        <!-- Main marker -->
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
          background: oklch(0.72 0.17 66.8);
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `;

    // Add hover effect
    markerEl.addEventListener("mouseenter", () => {
      const mainDiv = markerEl.querySelector("div > div:last-child") as HTMLElement;
      if (mainDiv) mainDiv.style.transform = "scale(1.1)";
    });
    markerEl.addEventListener("mouseleave", () => {
      const mainDiv = markerEl.querySelector("div > div:last-child") as HTMLElement;
      if (mainDiv) mainDiv.style.transform = "scale(1)";
    });

    // Add pulse animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Add marker to map
    marker.current = new maplibregl.Marker({ element: markerEl })
      .setLngLat(center)
      .addTo(map.current);

    // Create custom popup
    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: false,
      className: "custom-popup",
    }).setHTML(`
      <div style="
        padding: 12px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
          color: oklch(0.72 0.17 66.8);
        ">
          ${markerTitle}
        </div>
        <div style="
          font-size: 14px;
          color: #666;
        ">
          ${markerDescription}
        </div>
      </div>
    `);

    marker.current.setPopup(popup);

    // Show popup on load
    map.current.on("load", () => {
      setIsLoaded(true);
      popup.addTo(map.current!);
    });

    // Cleanup
    return () => {
      marker.current?.remove();
      map.current?.remove();
      map.current = null;
      document.head.removeChild(style);
    };
  }, [center, zoom, markerTitle, markerDescription, currentTheme]);

  // Update map style when theme changes
  useEffect(() => {
    if (map.current && isLoaded) {
      map.current.setStyle(getMapStyle(currentTheme));
    }
  }, [currentTheme, isLoaded]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-2xl" />
      
      {/* Custom loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-3 animate-bounce" />
            <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Map styles for light and dark themes
function getMapStyle(theme: string | undefined): maplibregl.StyleSpecification {
  const isDark = theme === "dark";

  // Using Protomaps basemap style with custom colors
  return {
    version: 8,
    sources: {
      protomaps: {
        type: "vector",
        url: "https://api.protomaps.com/tiles/v3.json?key=41392fb7515533a5",
        attribution:
          '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
      },
    },
    glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
    layers: [
      // Background
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": isDark ? "#0a0a0a" : "#f8f8f8",
        },
      },
      // Water
      {
        id: "water",
        type: "fill",
        source: "protomaps",
        "source-layer": "water",
        paint: {
          "fill-color": isDark ? "#1a1a2e" : "#a8dadc",
        },
      },
      // Landuse
      {
        id: "landuse-park",
        type: "fill",
        source: "protomaps",
        "source-layer": "landuse",
        filter: ["==", "class", "park"],
        paint: {
          "fill-color": isDark ? "#1a2e1a" : "#d4edda",
        },
      },
      // Buildings
      {
        id: "buildings",
        type: "fill",
        source: "protomaps",
        "source-layer": "buildings",
        paint: {
          "fill-color": isDark ? "#1f1f1f" : "#e8e8e8",
          "fill-opacity": 0.7,
        },
      },
      // Roads - major
      {
        id: "roads-major",
        type: "line",
        source: "protomaps",
        "source-layer": "roads",
        filter: ["in", "class", "motorway", "trunk", "primary"],
        paint: {
          "line-color": isDark ? "#2a2a2a" : "#ffffff",
          "line-width": ["interpolate", ["linear"], ["zoom"], 10, 2, 16, 8],
        },
      },
      // Roads - minor
      {
        id: "roads-minor",
        type: "line",
        source: "protomaps",
        "source-layer": "roads",
        filter: ["in", "class", "secondary", "tertiary", "minor"],
        paint: {
          "line-color": isDark ? "#252525" : "#f5f5f5",
          "line-width": ["interpolate", ["linear"], ["zoom"], 12, 1, 16, 4],
        },
      },
      // Road labels
      {
        id: "road-labels",
        type: "symbol",
        source: "protomaps",
        "source-layer": "roads",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Regular"],
          "text-size": 12,
          "symbol-placement": "line",
        },
        paint: {
          "text-color": isDark ? "#888888" : "#666666",
          "text-halo-color": isDark ? "#0a0a0a" : "#ffffff",
          "text-halo-width": 1,
        },
      },
      // Place labels
      {
        id: "place-labels",
        type: "symbol",
        source: "protomaps",
        "source-layer": "places",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 10, 12, 16, 18],
        },
        paint: {
          "text-color": isDark ? "#ffffff" : "#1a1a1a",
          "text-halo-color": isDark ? "#0a0a0a" : "#ffffff",
          "text-halo-width": 2,
        },
      },
    ],
  };
}
