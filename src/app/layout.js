// app/layout.tsx
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

// ✅ Font setup
const apfelGrotezkMittel = localFont({
  src: [{ path: "./fonts/ApfelGrotezk-Mittel.otf", weight: "400", style: "normal" }],
  variable: "--font-apfel-grotezk-mittel",
});

const apfelGrotezkRegular = localFont({
  src: [{ path: "./fonts/ApfelGrotezk-Regular.otf", weight: "400", style: "normal" }],
  variable: "--font-apfel-grotezk-regular",
});

const qimano = localFont({
  src: [{ path: "./fonts/Qimano-aYxdE.otf", weight: "400", style: "normal" }],
  variable: "--font-qimano",
});

// ✅ Metadata export will work now
export const metadata = {
  title: "Snatch",
  description: "Connecting Influencers",
  viewport: { width: "device-width", initialScale: 1 },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${apfelGrotezkMittel.variable}
          ${apfelGrotezkRegular.variable}
          ${qimano.variable}
          antialiased
        `}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
