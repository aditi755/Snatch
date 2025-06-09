// app/layout.tsx
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
// import Script from "next/script";

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

          {/* ✅ Feedbask Widget Script */}
        {/* <Script
          id="feedbask-widget-script"
          strategy="lazyOnload"
          src="https://cdn.feedbask.com/widget.js"
          data-client-key="d847c202-9bd5-4a9d-8e3a-8ec8f95ce897"
        /> */}
      </body>
    </html>
  );
}
