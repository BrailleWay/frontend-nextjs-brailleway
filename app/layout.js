import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
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
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
        
      </body>
    </html>
  );
}
