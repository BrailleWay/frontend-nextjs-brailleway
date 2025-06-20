import "./globals.css";


export const metadata = {
  title: "BrailleWay",
  description: "Site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
