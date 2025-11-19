// components/GoogleMapView.jsx
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "10px"
};

const center = {
  lat: 28.6139, // New Delhi
  lng: 77.209
};

const GoogleMapView = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "YOUR_API_KEY_HERE" // 🔑 Replace with your API key
  });

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <div className="text-center text-gray-500 p-4">Loading Map...</div>
  );
};

export default React.memo(GoogleMapView);
