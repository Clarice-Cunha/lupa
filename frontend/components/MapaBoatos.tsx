"use client";

/**
 * Mapa interativo de boatos usando Leaflet + OpenStreetMap.
 *
 * Modos de uso:
 *   - Visão geral: passa `marcadores` com lat/lng dos boatos; mostra pins.
 *   - Seletor: passa `onSelect`; o usuário clica no mapa para marcar localização.
 *
 * Leaflet é carregado dinamicamente (import inside useEffect) para evitar
 * erros de SSR, já que a biblioteca depende de `window`.
 */

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export type MarcadorBoato = {
  lat: number;
  lng: number;
  localidade: string;
  descricao: string;
  status?: string;
};

type Props = {
  marcadores?: MarcadorBoato[];
  onSelect?: (lat: number, lng: number) => void;
  latSelecionado?: number | null;
  lngSelecionado?: number | null;
  altura?: string;
};

// Centro padrão: Natal, RN
const LAT_PADRAO = -5.7945;
const LNG_PADRAO = -35.2110;
const ZOOM_PADRAO = 11;

export default function MapaBoatos({
  marcadores = [],
  onSelect,
  latSelecionado,
  lngSelecionado,
  altura = "360px",
}: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const pickerMarkerRef = useRef<import("leaflet").Marker | null>(null);

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    let mapa: import("leaflet").Map;

    (async () => {
      const L = (await import("leaflet")).default;

      // Corrige os caminhos dos ícones padrão que o webpack quebra
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      mapa = L.map(divRef.current!).setView(
        [LAT_PADRAO, LNG_PADRAO],
        ZOOM_PADRAO,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapa);

      // Adiciona marcadores dos boatos
      const leafletMarkers: import("leaflet").Marker[] = [];
      for (const m of marcadores) {
        const mk = L.marker([m.lat, m.lng])
          .addTo(mapa)
          .bindPopup(
            `<strong style="font-size:13px">${m.localidade}</strong>` +
              `<br/><span style="font-size:12px;color:#555">${m.descricao.slice(0, 120)}${m.descricao.length > 120 ? "…" : ""}</span>`,
          );
        leafletMarkers.push(mk);
      }

      // Ajusta o zoom para mostrar todos os marcadores
      if (leafletMarkers.length > 0) {
        const grupo = L.featureGroup(leafletMarkers);
        mapa.fitBounds(grupo.getBounds().pad(0.25));
      }

      // Adiciona pin de localização já selecionada (ao abrir o mapa)
      if (latSelecionado != null && lngSelecionado != null) {
        pickerMarkerRef.current = L.marker([latSelecionado, lngSelecionado])
          .addTo(mapa)
          .bindPopup("Localização selecionada")
          .openPopup();
        mapa.setView([latSelecionado, lngSelecionado], 14);
      }

      // Modo seletor: clicar no mapa cria/move o pin e chama onSelect
      if (onSelect) {
        mapa.on("click", (e) => {
          const { lat, lng } = e.latlng;
          if (pickerMarkerRef.current) pickerMarkerRef.current.remove();
          pickerMarkerRef.current = L.marker([lat, lng])
            .addTo(mapa)
            .bindPopup("Localização selecionada")
            .openPopup();
          onSelect(lat, lng);
        });
      }

      mapRef.current = mapa;
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      pickerMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={divRef}
      style={{ height: altura, width: "100%", zIndex: 0 }}
      className="rounded-2xl overflow-hidden border border-slate-200"
    />
  );
}
