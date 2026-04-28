"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Tema = "claro" | "escuro";

const ContextoTema = createContext<{
  tema: Tema;
  alternarTema: () => void;
}>({ tema: "claro", alternarTema: () => {} });

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    const salvo = localStorage.getItem("lupa-tema") as Tema | null;
    const prefereDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const inicial: Tema = salvo ?? (prefereDark ? "escuro" : "claro");
    setTema(inicial);
    document.documentElement.classList.toggle("dark", inicial === "escuro");
  }, []);

  function alternarTema() {
    setTema((atual) => {
      const novo: Tema = atual === "claro" ? "escuro" : "claro";
      localStorage.setItem("lupa-tema", novo);
      document.documentElement.classList.toggle("dark", novo === "escuro");
      return novo;
    });
  }

  return (
    <ContextoTema.Provider value={{ tema, alternarTema }}>
      {children}
    </ContextoTema.Provider>
  );
}

export function useTema() {
  return useContext(ContextoTema);
}
