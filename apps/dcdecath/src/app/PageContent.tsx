"use client"; // ✅ Assure que ce composant tourne uniquement côté client

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

// Style du conteneur principal
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  padding: 20px;
`;

// Style du compteur de pas
const StepCounterBox = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: #3498db;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 8px;
  text-align: center;
  width: 200px;
`;

// Icône personnalisée pour le marqueur
const customIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [38, 38],
});

// Composant pour recentrer la carte sur la position de l'utilisateur
function ChangeView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  map.setView(coords, 16);
  return null;
}

export default function PageContent() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [steps, setSteps] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Géolocalisation
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => console.error("Erreur de géolocalisation :", error),
        { enableHighAccuracy: true }
      );
    }

    // Compteur de pas via l'accéléromètre
    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      let lastY: number | null = null;

      const handleMotion = (event: DeviceMotionEvent) => {
        const acceleration = event.accelerationIncludingGravity;

        if (acceleration && acceleration.y !== null) {
          const yAcc = acceleration.y;

          if (lastY !== null && Math.abs(yAcc - lastY) > 2) {
            setSteps((prev) => prev + 1);
          }
          lastY = yAcc;
        }
      };

      window.addEventListener("devicemotion", handleMotion);
      return () => window.removeEventListener("devicemotion", handleMotion);
    }
  }, []);

  return (
    <Container>
      <h1>🏃 Suivi de votre activité avec Decathlon !</h1>

      {/* Affichage du compteur de pas */}
      <StepCounterBox>👣 Pas : {steps}</StepCounterBox>

      {/* Affichage de la carte */}
      <div style={{ width: "100%", maxWidth: "500px", height: "400px", borderRadius: "8px", overflow: "hidden" }}>
        {isClient && position ? (
          <MapContainer center={position} zoom={16} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} icon={customIcon} />
            <ChangeView coords={position} />
          </MapContainer>
        ) : (
          <p className="text-center">📡 Localisation en cours...</p>
        )}
      </div>
    </Container>
  );
}
