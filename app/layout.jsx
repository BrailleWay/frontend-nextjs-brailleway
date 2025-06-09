import { Urbanist, Poppins, Inter } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist-sans",
  subsets: ["latin"],
});



export const metadata = {
  title: "BrailleWay",
  description: "Site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
