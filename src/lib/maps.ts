import { useLoadScript } from "@react-google-maps/api";

export const googleLibraries: ("places" | "geometry" | "marker")[] = ["places", "geometry"];

export function useGoogleMaps() {
  try {
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      libraries: googleLibraries,
    });
    return { isLoaded, loadError };
  } catch (e) {
    // Return safe defaults if this is called on server or before API loads
    return { isLoaded: false, loadError: null };
  }
}
