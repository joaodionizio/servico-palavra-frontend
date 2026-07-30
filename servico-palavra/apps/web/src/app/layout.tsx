import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Servico da Palavra",
  description: "Plataforma de Formacao Biblica e Espiritual",
  icons: {
    icon: "/sentinelas-da-manha.png",
    shortcut: "/sentinelas-da-manha.png",
    apple: "/sentinelas-da-manha.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("servico-palavra-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}`
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
