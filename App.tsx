import React, { useState, useEffect } from "react";

interface User {
  id: string;
  lat: number;
  lng: number;
  instagram: string;
  snapchat: string;
}

export default function App() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [radius, setRadius] = useState<number>(20);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Dummy nearby users (replace with real Firebase pull later)
  useEffect(() => {
    if (location) {
      const dummyUsers = [
        {
          id: "1",
          lat: location.lat + 0.0001,
          lng: location.lng + 0.0001,
          instagram: "user1_insta",
          snapchat: "user1_snap",
        },
        {
          id: "2",
          lat: location.lat - 0.0001,
          lng: location.lng - 0.0001,
          instagram: "user2_insta",
          snapchat: "user2_snap",
        },
      ];
      setUsers(dummyUsers);
    }
  }, [location]);

  const handleClickUser = (user: User) => {
    alert(`Instagram: ${user.instagram}\nSnapchat: ${user.snapchat}`);
  };

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#0a0a0a", color: "white", fontFamily: "Outfit, sans-serif" }}>
      <h1 style={{ textAlign: "center", padding: "1rem" }}>Zoned - Live Radar</h1>

      {location ? (
        <div style={{ padding: "1rem" }}>
          <p>Your location:</p>
          <p>Latitude: {location.lat.toFixed(6)}</p>
          <p>Longitude: {location.lng.toFixed(6)}</p>

          <div style={{ marginTop: "2rem" }}>
            <input
              type="range"
              min="5"
              max="150"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
            <p>{radius} ft radius</p>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h2>Nearby Users:</h2>
            {users
              .filter(
                (user) =>
                  Math.abs(user.lat - location.lat) * 364000 <= radius &&
                  Math.abs(user.lng - location.lng) * 288200 <= radius
              )
              .map((user) => (
                <div
                  key={user.id}
                  style={{
                    background: "#1a1a1a",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClickUser(user)}
                >
                  <p>User ID: {user.id}</p>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "4rem" }}>Getting location...</p>
      )}
    </div>
  );
}
