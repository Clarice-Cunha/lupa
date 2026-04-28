import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navegacao from "./_components/Navegacao";
import Rodape from "./_components/Rodape";
import WidgetFeedback from "./_components/WidgetFeedback";
import { TemaProvider } from "@/lib/tema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUPA — Apoio à checagem de conteúdos digitais",
  description:
    "Analise URLs e descubra sinais de confiabilidade, risco e contexto antes de compartilhar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          Script executado ANTES do React carregar.
          Evita o "flash" de tema errado: lê o localStorage e aplica
          a classe .dark imediatamente, sem esperar o JavaScript do app.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var tema = localStorage.getItem('lupa-tema');
                var prefereDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (tema === 'escuro' || (!tema && prefereDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-indigo-700 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          Pular para o conteúdo
        </a>
        <TemaProvider>
          <Navegacao />
          <div id="conteudo-principal" className="contents">
            {children}
          </div>
          <Rodape />
          <WidgetFeedback />
        </TemaProvider>
      </body>
    </html>
  );
}
