"use client";
import dynamic from "next/dynamic";
import { useGoogleMaps } from "@/lib/maps";
import { ItineraryEvent } from "@/lib/firestore";
import { useMemo, useState } from "react";

const GoogleMap = dynamic(() => import("@react-google-maps/api").then(m => ({ default: m.GoogleMap })), { ssr: false });
const Marker = dynamic(() => import("@react-google-maps/api").then(m => ({ default: m.Marker })), { ssr: false });
const InfoWindow = dynamic(() => import("@react-google-maps/api").then(m => ({ default: m.InfoWindow })), { ssr: false });

type Props = { events: ItineraryEvent[] };

export default function MapsTab({ events }: Props) {
  const { isLoaded } = useGoogleMaps();
  const [activeId, setActiveId] = useState<string | null>(null);
  const pins = useMemo(() => events.filter((e) => e.location), [events]);
  const center = pins[0]?.location || { lat: 37.7749, lng: -122.4194 };

  return (
    <div className="h-[60vh] card overflow-hidden">
      {isLoaded ? (
        <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={center as any} zoom={pins.length ? 12 : 3}>
          {pins.map((ev) => (
            <Marker key={ev.id} position={ev.location as any} onClick={() => setActiveId(ev.id!)} />
          ))}
          {pins.map((ev) => (
            activeId === ev.id ? (
              <InfoWindow key={ev.id} position={ev.location as any} onCloseClick={() => setActiveId(null)}>
                <div>
                  <div className="font-semibold">{ev.title}</div>
                  {ev.location?.address && <div className="text-sm">{ev.location.address}</div>}
                  <a
                    className="text-blue-600 underline text-sm"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${ev.location!.lat},${ev.location!.lng}`}
                    target="_blank"
                  >
                    Get Directions
                  </a>
                </div>
              </InfoWindow>
            ) : null
          ))}
        </GoogleMap>
      ) : (
        <div className="flex h-full items-center justify-center">Loading map…</div>
      )}
    </div>
  );
}
