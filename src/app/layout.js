// import { Inter } from "next/font/google";
// import "./global.css";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "INFORMATEC",
//   description: "PRIMERA APP REGISTROS",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="es">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }
// Archivo: app/layout.js

// Importar Montserrat de next/font/google
import { Montserrat } from "next/font/google";
import "./global.css";

// 1. DEFINIR LA FUENTE MONTSERRAT
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"], // Definir los pesos que usarás
});

export const metadata = {
  title: "INFORMATEC",
  description: "PRIMERA APP REGISTROS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
