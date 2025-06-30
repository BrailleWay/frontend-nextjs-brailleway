// app/layout.js
import "./globals.css";
import Header from "./ui/home/Header";
import Footer from "./ui/home/Footer";
import { Urbanist, Inter, Poppins } from "next/font/google";
import Script from "next/script"; // ✅ Importar Script corretamente

// Fonte principal/padrão do site
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Fontes secundárias como variáveis
const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  title: "BrailleWay",
  description: "Site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${urbanist.variable} ${poppins.variable}`}>
      <body>
        {/* ✅ Script do UserWay acessível e sem erro */}
        <Script
          src="https://cdn.userway.org/widget.js"
          strategy="afterInteractive"
          data-account="An0lOgTRcx"
        />
        
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
