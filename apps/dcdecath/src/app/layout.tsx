"use client";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service Worker enregistré"))
        .catch((error) => console.error("Erreur Service Worker :", error));
    }
  }, []);

  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
