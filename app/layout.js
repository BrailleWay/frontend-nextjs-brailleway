// app/layout.js

import "./globals.css";
import Header from "./ui/home/Header";
import Footer from "./ui/home/Footer";

export const metadata = {
  title: "BrailleWay",
  description: "Site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}