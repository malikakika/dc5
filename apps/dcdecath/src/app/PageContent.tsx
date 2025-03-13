"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

// 📌 Styles
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #eef3ff;
  padding: 10px;
  position: relative;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 65vh;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
`;

const InfoBar = styled.div`
  width: 100%;
  background: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px 15px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 15px;
  margin: 0 5px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #3646BA;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

const StepCounterBox = styled.div`
  margin: 10px 0;
  padding: 10px;
  background: #3646BA;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  text-align: center;
  width: 180px;
`;

// 📌 Icône personnalisée pour les marqueurs
const customIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [38, 38],
});

// 📌 Composant pour recentrer la carte
function ChangeView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 14);
  }, [coords, map]);
  return null;
}

// 📌 Composant principal
export default function RunningTracker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<L.LatLngTuple[]>([]);
  const [steps, setSteps] = useState(0);
  const stepsRef = useRef(0);

  // ✅ **Memoizing startPoint and endPoint to avoid unnecessary re-renders**
  const startPoint = useMemo(() => [48.8588443, 2.2943506] as [number, number], []);
  const endPoint = useMemo(() => [48.8606, 2.3376] as [number, number], []);

  // 📌 Récupération de l'itinéraire entre startPoint et endPoint
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const start = `${startPoint[1]},${startPoint[0]}`;
        const end = `${endPoint[1]},${endPoint[0]}`;
        const url = `https://router.project-osrm.org/route/v1/foot/${start};${end}?overview=simplified&geometries=geojson`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);
          setRoute(coordinates);
        } else {
          console.error("Aucun itinéraire trouvé.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du trajet :", error);
      }
    };

    fetchRoute();
  }, [startPoint, endPoint]); // ✅ `useEffect` now only runs when startPoint or endPoint change

  // 📌 Géolocalisation + Compteur de pas
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => console.error("Erreur de géolocalisation :", error),
        { enableHighAccuracy: true }
      );
    }

    // 📌 Activation du compteur de pas avec accéléromètre
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
      {/* 📌 Compteur de pas */}
      <StepCounterBox>👣 Pas : {steps}</StepCounterBox>

      {/* 📌 Carte avec itinéraire */}
      <MapWrapper>
        <MapContainer center={startPoint} zoom={14} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* 🚀 Affichage du trajet */}
          {route.length > 0 && <Polyline positions={route} color="#3646BA" weight={6} />}
          
          {/* 📍 Point de départ */}
          <Marker position={startPoint} icon={customIcon} />
          
          {/* 📍 Point d'arrivée */}
          <Marker position={endPoint} icon={customIcon} />

          {/* 🔄 Mise à jour de la position */}
          {position && <ChangeView coords={position} />}
        </MapContainer>
      </MapWrapper>

      {/* 📌 Barre d'informations */}
      <InfoBar>
        <div>
          <strong style={{ color: "#3646BA", fontSize: "20px" }}>Tour Eiffel → Louvre</strong>
          <p style={{ fontSize: "12px", color: "#666" }}>Itinéraire sélectionné</p>
        </div>
        <div>
          <strong style={{ color: "#3646BA", fontSize: "20px" }}>{steps} pas</strong>
          <p style={{ fontSize: "12px", color: "#666" }}>Compteur de pas</p>
        </div>
        <div style={{ display: "flex", width: "100%", padding: "10px" }}>
        <ActionButton>Pause</ActionButton>
        <ActionButton>Terminer</ActionButton>
      </div>
      </InfoBar>      
    </Container>
  );
}
