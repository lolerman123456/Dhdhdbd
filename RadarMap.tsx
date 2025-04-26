import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, Circle, useLoadScript } from "@react-google-maps/api";
import { useNearbyUsers } from "../hooks/useNearbyUsers";
import { useLocationUpdater } from "../hooks/useLocationUpdater";

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [], // Add your dark mode styles here later if you want
};

const center = {
  lat: 25.7617,  // Default Miami coordinates (fallback)
  lng: -80.1918,
};

export default function RadarMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // << Replace with your real key
    libraries,
  });

  const [currentPosition, setCurrentPosition] = useState(center);
  const [radius, setRadius] = useState(20); // Default 20ft
  const mapRef = useRef<google.maps.Map | null>(null);

  const { users } = useNearbyUsers(currentPosition, radius);
  useLocationUpdater(currentPosition);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location access is needed to use Zoned.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  }, []);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const recenterMap = () => {
    if (mapRef.current) {
      mapRef.current.panTo(currentPosition);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10, color: "white", fontWeight: "bold", fontSize: "24px" }}>
        Zoned
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={18}
        center={currentPosition}
        options={options}
        onLoad={onMapLoad}
      >
        <Marker position={currentPosition} />
        <Circle center={currentPosition} radius={radius} options={{
          fillColor: "#FF0000",
          fillOpacity: 0.1,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        }} />

        {users.map((user) => (
          <Marker
            key={user.id}
            position={{
              lat: user.location.lat,
              lng: user.location.lng,
            }}
            onClick={() => {
              // You can show their socials here later
              alert(`Clicked on user: ${user.username}`);
            }}
          />
        ))}
      </GoogleMap>

      {/* Recenter Button */}
      <button
        style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          backgroundColor: "#FF5C5C",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          color: "white",
          fontSize: 24,
          cursor: "pointer",
          zIndex: 10,
        }}
        onClick={recenterMap}
      >
        ⟳
      </button>

      {/* Radius Slider */}
      <div style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        zIndex: 10,
      }}>
        <div>{radius.toFixed(1)} feet radius</div>
        <input
          type="range"
          min={5}
          max={150}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
}
