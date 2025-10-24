import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ContactModalProvider } from "@/components/ui/contact-modal";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth-context";
import { ChatbotProvider } from "@/components/ui/chat-widget";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Clonchat - Crea tu Chatbot de Negocio en Minutos",
  description:
    "Plataforma para crear chatbots personalizados para tu negocio. Gestiona pedidos y reservas con inteligencia artificial. Sin código, con subdominio incluido.",
  keywords: [
    "chatbot",
    "IA",
    "inteligencia artificial",
    "pedidos",
    "reservas",
    "restaurante",
    "negocio",
    "automatización",
    "sin código",
    "subdominio",
  ],
  openGraph: {
    title: "Clonchat - Crea tu Chatbot de Negocio",
    description:
      "Chatbots personalizados para gestionar pedidos y reservas. Configuración sin código, subdominio incluido.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} antialiased`}>
        <I18nProvider>
          <AuthProvider>
            <ContactModalProvider>
              <ChatbotProvider>{children}</ChatbotProvider>
            </ContactModalProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
