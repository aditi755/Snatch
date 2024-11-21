import localFont from "next/font/local";
import "./globals.css";

// Load the .otf fonts using localFont
const apfelGrotezkMittel = localFont({
  src: [
    {
      path: "./fonts/ApfelGrotezk-Mittel.otf", // Path to the font
      weight: "400", // Adjust weight as needed
      style: "normal", // Adjust style as needed
    },
  ],
  variable: "--font-apfel-grotezk-mittel", // CSS variable to apply font globally
});

const apfelGrotezkRegular = localFont({
  src: [
    {
      path: "./fonts/ApfelGrotezk-Regular.otf", // Path to the font
      weight: "400", // Adjust weight as needed
      style: "normal", // Adjust style as needed
    },
  ],
  variable: "--font-apfel-grotezk-regular", // CSS variable to apply font globally
});

const qimano = localFont({
  src: [
    {
      path: "./fonts/Qimano-aYxdE.otf", // Path to the font
      weight: "400", // Adjust weight as needed
      style: "normal", // Adjust style as needed
    },
  ],
  variable: "--font-qimano", // CSS variable to apply font globally
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
