import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Suraj K. Chandurkar - Software Developer | Portfolio & Captcha Test Lab",
  description: "Personal web page of Suraj K. Chandurkar, currently working as a Software Developer. Featuring full-stack projects, OCR & automation engineering, and an interactive Captcha Test Lab.",
  keywords: ["Suraj K Chandurkar", "Software Developer", "Full Stack Developer", "Captcha Test", "OCR Engineer", "React", "Next.js"],
  authors: [{ name: "Suraj K. Chandurkar" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07090e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <div className="bg-ambient">
          <div className="glow-orb-1" />
          <div className="glow-orb-2" />
          <div className="glow-orb-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
