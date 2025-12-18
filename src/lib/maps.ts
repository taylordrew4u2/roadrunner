import { useLoadScript } from "@react-google-maps/api";

export const googleLibraries: ("places" | "geometry" | "marker")[] = ["places", "geometry"];

export function useGoogleMaps() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: googleLibraries,
  });
  return { isLoaded, loadError };
}
