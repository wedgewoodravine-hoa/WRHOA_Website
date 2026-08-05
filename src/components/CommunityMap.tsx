"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

type Props = {
  caption?: string;
  className?: string;
};

const MAPS_SCRIPT_ID = "google-maps-js";

const HIDE_BUSINESS_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
];

function mapsLink() {
  return `https://www.google.com/maps/@${site.map.lat},${site.map.lng},${site.map.zoom}z/data=!3m1!1e3?entry=ttu`;
}

function iframeEmbedSrc() {
  return `https://maps.google.com/maps?q=${site.map.lat},${site.map.lng}&z=${site.map.zoom}&t=k&hl=en&output=embed`;
}

function loadGoogleMaps(apiKey: string): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  if (window.google?.maps?.Map) {
    return Promise.resolve(window.google.maps);
  }

  const existing = document.getElementById(MAPS_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => {
        if (window.google?.maps) resolve(window.google.maps);
        else reject(new Error("Google Maps failed to initialize."));
      });
      existing.addEventListener("error", () =>
        reject(new Error("Google Maps script failed to load.")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = MAPS_SCRIPT_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.onload = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else reject(new Error("Google Maps failed to initialize."));
    };
    script.onerror = () => reject(new Error("Google Maps script failed to load."));
    document.head.appendChild(script);
  });
}

export function CommunityMap({
  caption = "Satellite view",
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  const [useFallback, setUseFallback] = useState(!apiKey);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    apiKey ? "loading" : "error",
  );

  useEffect(() => {
    if (!apiKey || !containerRef.current || mapRef.current) return;

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !containerRef.current) return;

        const map = new maps.Map(containerRef.current, {
          center: { lat: site.map.lat, lng: site.map.lng },
          zoom: site.map.zoom,
          // Hybrid = satellite imagery + label overlay (styles can hide businesses).
          mapTypeId: maps.MapTypeId.HYBRID,
          // JSON styles only apply on raster maps.
          renderingType: maps.RenderingType?.RASTER,
          styles: HIDE_BUSINESS_STYLES,
          clickableIcons: false,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "cooperative",
        });

        new maps.Marker({
          map,
          position: { lat: site.map.lat, lng: site.map.lng },
          title: site.name,
        });

        mapRef.current = map;
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setUseFallback(true);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  return (
    <figure className={`community-map min-w-0 ${className ?? ""}`.trim()}>
      <div className="community-map__mat">
        {useFallback ? (
          <iframe
            title={`Google Map of ${site.name}`}
            src={iframeEmbedSrc()}
            className="community-map__frame"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div
            ref={containerRef}
            className="community-map__frame"
            role="region"
            aria-label={`Satellite map of ${site.name}`}
            aria-busy={status === "loading"}
          />
        )}
      </div>
      <figcaption className="community-map__caption">
        <span>{caption}</span>
        <a href={mapsLink()} target="_blank" rel="noreferrer">
          Open in Google Maps →
        </a>
      </figcaption>
    </figure>
  );
}
