"use client";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

// 📌 Styles
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  padding: 20px;
`;

const StepCounterBox = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: #3646BA;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 8px;
  text-align: center;
  width: 200px;
`;

const MapWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 📌 Icône personnalisée pour le marqueur
const customIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [38, 38],
});

// 📌 Composant pour recentrer la carte automatiquement
function ChangeView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 16);
  }, [coords, map]);
  return null;
}

// 📌 Page principale
export default function PageContent() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [steps, setSteps] = useState(0);
  const [geoError, setGeoError] = useState<string | null>(null);
  const stepsRef = useRef(0);

  useEffect(() => {
    // 📌 Activation de la géolocalisation
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setGeoError(null);
        },
        (error) => {
          console.error("Erreur de géolocalisation :", error);
          setGeoError("⚠️ Impossible d'accéder à la géolocalisation !");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setGeoError("⚠️ La géolocalisation n'est pas supportée par votre appareil.");
    }

    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      let lastAcceleration = 0;

      const handleMotion = (event: DeviceMotionEvent) => {
        const acc = event.accelerationIncludingGravity;
        if (acc) {
          const totalAcceleration = Math.sqrt(
            Math.pow(acc.x || 0, 2) +
              Math.pow(acc.y || 0, 2) +
              Math.pow(acc.z || 0, 2)
          );

          if (Math.abs(totalAcceleration - lastAcceleration) > 2) {
            stepsRef.current += 1;
            setSteps(stepsRef.current);
          }
          lastAcceleration = totalAcceleration;
        }
      };

      window.addEventListener("devicemotion", handleMotion);
      return () => window.removeEventListener("devicemotion", handleMotion);
    }
  }, []);

  return (
    <Container>
      <h1>🏃 Suivi de votre activité avec Decathlon !</h1>

      {/* 📌 Affichage du compteur de pas */}
      <StepCounterBox>👣 Pas : {steps}</StepCounterBox>

      {/* 📌 Affichage de la carte avec la position */}
      <MapWrapper>
        {geoError ? (
          <p>{geoError}</p>
        ) : position ? (
          <MapContainer center={position} zoom={16} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} icon={customIcon} />
            <ChangeView coords={position} />
          </MapContainer>
        ) : (
          <p>📡 Localisation en cours...</p>
        )}
      </MapWrapper>
    </Container>
  );
}
