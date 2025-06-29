// app/layout.js
import "./globals.css";
import Header from "./ui/home/Header";
import Footer from "./ui/home/Footer";
import { Urbanist, Inter, Poppins } from "next/font/google";

// Fonte principal/padrão do site
const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // Melhora o carregamento
  variable: '--font-inter', // Opcional, mas boa prática
});

// Fontes secundárias como variáveis
const urbanist = Urbanist({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-urbanist', // Cria a variável CSS
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  variable: '--font-poppins', // Cria a variável CSS
});

export const metadata = {
  title: "BrailleWay",
  description: "Site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${urbanist.variable} ${poppins.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}