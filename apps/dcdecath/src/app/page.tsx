"use client"; // 🚀 Assure que le fichier tourne uniquement côté client

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Désactiver le pré-rendering serveur (important pour éviter `window is not defined`)
const NoSSRPage = dynamic(() => import("./PageContent"), { ssr: false });

export default function Home() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <NoSSRPage />
    </Suspense>
  );
}
