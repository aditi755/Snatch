import localFont from "next/font/local";
import "./globals.css";

const apfelGrotezkMittel = localFont({
  src: [
    {
      path: "./fonts/ApfelGrotezk-Mittel.otf", 
      weight: "400", 
      style: "normal", 
    },
  ],
  variable: "--font-apfel-grotezk-mittel", 
});

const apfelGrotezkRegular = localFont({
  src: [
    {
      path: "./fonts/ApfelGrotezk-Regular.otf", 
      weight: "400",
      style: "normal", 
    },
  ],
  variable: "--font-apfel-grotezk-regular", 
});

const qimano = localFont({
  src: [
    {
      path: "./fonts/Qimano-aYxdE.otf", 
      weight: "400", 
      style: "normal", 
    },
  ],
  variable: "--font-qimano", 
});

export const metadata = {
  title: "Snatch",
  description: "Connecting Influencers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${apfelGrotezkMittel.variable} ${apfelGrotezkRegular.variable} ${qimano.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
