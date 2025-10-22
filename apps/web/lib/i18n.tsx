"use client";

import React, { createContext, useContext, useState } from "react";

export type Locale = "es" | "en";

type Dictionary = {
  // Navigation
  nav_features: string;
  nav_how_it_works: string;
  nav_clients: string;
  nav_contact: string;
  nav_login: string;
  nav_dashboard: string;

  // Hero
  hero_title_1: string;
  hero_title_2: string;
  hero_title_3: string;
  hero_desc: string;
  hero_cta_primary: string;
  hero_card_1_title: string;
  hero_card_1_desc: string;
  hero_card_2_title: string;
  hero_card_2_desc: string;

  // Value Proposition
  value_prop_text: string;

  // Features
  features_title: string;
  features_sub: string;
  feature_1_title: string;
  feature_1_desc: string;
  feature_2_title: string;
  feature_2_desc: string;
  feature_3_title: string;
  feature_3_desc: string;
  feature_4_title: string;
  feature_4_desc: string;
  feature_5_title: string;
  feature_5_desc: string;
  feature_6_title: string;
  feature_6_desc: string;

  // How it works
  how_title: string;
  how_sub: string;
  how_step_1_title: string;
  how_step_1_desc: string;
  how_step_2_title: string;
  how_step_2_desc: string;
  how_step_3_title: string;
  how_step_3_desc: string;

  // Stats
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  stat_4_value: string;
  stat_4_label: string;

  // Testimonials
  testimonials_title: string;
  testimonials_sub: string;
  testimonial_1_text: string;
  testimonial_1_name: string;
  testimonial_1_role: string;
  testimonial_2_text: string;
  testimonial_2_name: string;
  testimonial_2_role: string;
  testimonial_3_text: string;
  testimonial_3_name: string;
  testimonial_3_role: string;

  // CTA
  cta_title: string;
  cta_desc: string;
  cta_primary: string;
  cta_secondary: string;
  cta_note: string;

  // Footer
  footer_about: string;
  footer_about_text: string;
  footer_links: string;
  footer_legal: string;
  footer_privacy: string;
  footer_terms: string;
  footer_contact: string;
  footer_global: string;
  footer_rights: string;

  // Contact Modal
  contact_title: string;
  contact_desc: string;
  contact_name_placeholder: string;
  contact_email_placeholder: string;
  contact_company_placeholder: string;
  contact_message_placeholder: string;
  contact_cancel: string;
  contact_send: string;
  contact_note: string;

  // Auth
  login_title: string;
  login_subtitle: string;
  register_title: string;
  register_subtitle: string;
  email_label: string;
  password_label: string;
  name_label: string;
  login_button: string;
  register_button: string;
  have_account: string;
  no_account: string;
};

const dictionaries: Record<Locale, Dictionary> = {
  es: {
    // Navigation
    nav_features: "Características",
    nav_how_it_works: "Cómo Funciona",
    nav_clients: "Clientes",
    nav_contact: "Contacto",
    nav_login: "Iniciar Sesión",
    nav_dashboard: "Panel",

    // Hero
    hero_title_1: "Chatbots Inteligentes para",
    hero_title_2: "Citas y Pedidos",
    hero_title_3: "",
    hero_desc:
      "Automatiza la gestión de citas y pedidos con IA. Subdominio personalizado, panel de administración y tecnología RAG para que tu chatbot aprenda de tus documentos.",
    hero_cta_primary: "Crea tu Chatbot Gratis",
    hero_card_1_title: "Chatbot de Citas",
    hero_card_1_desc:
      "Gestiona reservas y citas automáticamente. Integración con Google Calendar, confirmaciones automáticas y recordatorios.",
    hero_card_2_title: "Chatbot de Pedidos",
    hero_card_2_desc:
      "Recibe y gestiona pedidos 24/7. Tu carta en PDF se convierte en un asistente que conoce todos tus productos.",

    // Value Proposition
    value_prop_text:
      "Deja que hagamos el trabajo tedioso y repetitivo por ti, y céntrate en lo que realmente importa: tu negocio",

    // Features
    features_title: "Dos soluciones, infinitas posibilidades",
    features_sub:
      "Elige el tipo de chatbot que necesitas o combínalos. Diseñados específicamente para negocios reales",
    feature_1_title: "Chatbot de Citas",
    feature_1_desc:
      "Gestiona reservas automáticamente con integración a Google Calendar. Los clientes eligen fecha y hora, reciben confirmación y recordatorios sin intervención manual.",
    feature_2_title: "Chatbot de Pedidos",
    feature_2_desc:
      "Recibe pedidos en tiempo real. El bot conoce tu catálogo completo, responde consultas sobre productos y envía pedidos directamente a tu panel de gestión.",
    feature_3_title: "Tecnología RAG",
    feature_3_desc:
      "Sube tu menú, catálogo o información en PDF. El chatbot procesa y aprende automáticamente, respondiendo preguntas sobre tus productos como un experto.",
    feature_4_title: "Subdominio Personalizado",
    feature_4_desc:
      "Obtén tu propia URL al instante: tunegocio.clonchat.com. Cada negocio tiene su espacio web con el chatbot y panel de administración incluido.",
    feature_5_title: "Panel de Administración",
    feature_5_desc:
      "Dashboard intuitivo para gestionar pedidos y citas. Cambia estados, acepta o rechaza pedidos, y comunícate con clientes desde un solo lugar.",
    feature_6_title: "Personalización Total",
    feature_6_desc:
      "Personaliza colores, logo, y el comportamiento del agente. El chatbot refleja la identidad de tu marca en cada interacción.",

    // How it works
    how_title: "Tres pasos para tu chatbot",
    how_sub: "Configura tu asistente virtual en menos de 5 minutos",
    how_step_1_title: "Regístrate",
    how_step_1_desc:
      "Crea tu cuenta con Google o email. Completa un wizard simple con el nombre de tu negocio, descripción y logo.",
    how_step_2_title: "Configura tu Bot",
    how_step_2_desc:
      "Elige Citas o Pedidos, sube tu carta/catálogo en PDF para que el bot aprenda con RAG, personaliza colores y el prompt del agente.",
    how_step_3_title: "Recibe tu Subdominio",
    how_step_3_desc:
      "Tu chatbot se despliega en tunegocio.clonchat.com automáticamente. Accede a tu panel de administración y comienza a recibir clientes.",

    // Stats
    stat_1_value: "5 min",
    stat_1_label: "Tiempo de configuración",
    stat_2_value: "0 código",
    stat_2_label: "Sin programación",
    stat_3_value: "24/7",
    stat_3_label: "Disponibilidad del bot",
    stat_4_value: "Multi-canal",
    stat_4_label: "Opciones de despliegue",

    // Testimonials
    testimonials_title: "Lo que dicen nuestros clientes",
    testimonials_sub:
      "Negocios reales que mejoraron su atención al cliente con Clonchat",
    testimonial_1_text:
      "Desde que implementamos el chatbot de pedidos, nuestras ventas aumentaron un 40%. Los clientes pueden pedir a cualquier hora y nosotros organizamos todo desde el panel.",
    testimonial_1_name: "Carlos Mendoza",
    testimonial_1_role: "Dueño, Restaurante El Canario",
    testimonial_2_text:
      "El sistema de reservas automatizado nos cambió la vida. Ya no perdemos reservas por llamadas perdidas. Todo queda registrado y confirmado automáticamente.",
    testimonial_2_name: "Ana Martínez",
    testimonial_2_role: "Gerente, Hotel Plaza",
    testimonial_3_text:
      "Configuré el chatbot en menos de 10 minutos. Subí mi carta en PDF y ya está atendiendo clientes. La personalización con nuestros colores quedó perfecta.",
    testimonial_3_name: "Luis Fernández",
    testimonial_3_role: "Propietario, Café Central",

    // CTA
    cta_title: "¿Listo para crear tu chatbot?",
    cta_desc:
      "Únete a cientos de negocios que ya están automatizando su atención al cliente",
    cta_primary: "Crea tu Chatbot Gratis",
    cta_secondary: "Contactar con Ventas",
    cta_note: "Prueba gratis • Sin tarjeta • Subdominio incluido",

    // Footer
    footer_about: "Sobre Clonchat",
    footer_about_text:
      "Plataforma de chatbots inteligentes especializados en citas y pedidos. Tecnología RAG, subdominios personalizados y panel de administración. Automatiza tu negocio con IA accesible.",
    footer_links: "Enlaces",
    footer_legal: "Legal",
    footer_privacy: "Privacidad",
    footer_terms: "Términos",
    footer_contact: "Contacto",
    footer_global: "Disponible globalmente",
    footer_rights: "Todos los derechos reservados.",

    // Contact Modal
    contact_title: "Contáctanos",
    contact_desc: "Cuéntanos sobre tus necesidades. Te contactaremos pronto.",
    contact_name_placeholder: "Tu nombre",
    contact_email_placeholder: "Email de trabajo",
    contact_company_placeholder: "Empresa",
    contact_message_placeholder: "¿Cómo podemos ayudarte?",
    contact_cancel: "Cancelar",
    contact_send: "Enviar email",
    contact_note: "Tu mensaje se enviará directamente a nuestro equipo",

    // Auth
    login_title: "Iniciar Sesión",
    login_subtitle: "Accede a tu cuenta de Clonchat",
    register_title: "Crear Cuenta",
    register_subtitle: "Comienza a crear tu chatbot hoy",
    email_label: "Email",
    password_label: "Contraseña",
    name_label: "Nombre (opcional)",
    login_button: "Iniciar Sesión",
    register_button: "Registrarse",
    have_account: "¿Ya tienes cuenta?",
    no_account: "¿No tienes cuenta?",
  },
  en: {
    // Navigation
    nav_features: "Features",
    nav_how_it_works: "How It Works",
    nav_clients: "Clients",
    nav_contact: "Contact",
    nav_login: "Log In",
    nav_dashboard: "Dashboard",

    // Hero
    hero_title_1: "Smart Chatbots for",
    hero_title_2: "Appointments & Orders",
    hero_title_3: "",
    hero_desc:
      "Automate appointment and order management with AI. Custom subdomain, admin dashboard, and RAG technology so your chatbot learns from your documents.",
    hero_cta_primary: "Create Your Chatbot Free",
    hero_card_1_title: "Appointment Chatbot",
    hero_card_1_desc:
      "Manage bookings and appointments automatically. Google Calendar integration, automatic confirmations and reminders.",
    hero_card_2_title: "Order Chatbot",
    hero_card_2_desc:
      "Receive and manage orders 24/7. Your PDF menu becomes an assistant that knows all your products.",

    // Value Proposition
    value_prop_text:
      "Let us handle the tedious and repetitive work for you, and focus on what really matters: your business",

    // Features
    features_title: "Two solutions, infinite possibilities",
    features_sub:
      "Choose the chatbot type you need or combine them. Designed specifically for real businesses",
    feature_1_title: "Appointment Chatbot",
    feature_1_desc:
      "Manage bookings automatically with Google Calendar integration. Customers choose date and time, receive confirmation and reminders without manual intervention.",
    feature_2_title: "Order Chatbot",
    feature_2_desc:
      "Receive orders in real-time. The bot knows your complete catalog, answers product questions and sends orders directly to your management panel.",
    feature_3_title: "RAG Technology",
    feature_3_desc:
      "Upload your menu, catalog or information in PDF. The chatbot processes and learns automatically, answering questions about your products like an expert.",
    feature_4_title: "Custom Subdomain",
    feature_4_desc:
      "Get your own URL instantly: yourbusiness.clonchat.com. Each business gets its web space with chatbot and admin panel included.",
    feature_5_title: "Admin Dashboard",
    feature_5_desc:
      "Intuitive dashboard to manage orders and appointments. Change states, accept or reject orders, and communicate with customers from one place.",
    feature_6_title: "Full Customization",
    feature_6_desc:
      "Customize colors, logo, and agent behavior. The chatbot reflects your brand identity in every interaction.",

    // How it works
    how_title: "Three steps to your chatbot",
    how_sub: "Set up your virtual assistant in less than 5 minutes",
    how_step_1_title: "Sign Up",
    how_step_1_desc:
      "Create your account with Google or email. Complete a simple wizard with your business name, description and logo.",
    how_step_2_title: "Configure Your Bot",
    how_step_2_desc:
      "Choose Appointments or Orders, upload your menu/catalog in PDF for the bot to learn with RAG, customize colors and agent prompt.",
    how_step_3_title: "Get Your Subdomain",
    how_step_3_desc:
      "Your chatbot deploys to yourbusiness.clonchat.com automatically. Access your admin panel and start receiving customers.",

    // Stats
    stat_1_value: "5 min",
    stat_1_label: "Setup time",
    stat_2_value: "0 code",
    stat_2_label: "No programming",
    stat_3_value: "24/7",
    stat_3_label: "Bot availability",
    stat_4_value: "Multi-channel",
    stat_4_label: "Deployment options",

    // Testimonials
    testimonials_title: "What our customers say",
    testimonials_sub:
      "Real businesses that improved their customer service with Clonchat",
    testimonial_1_text:
      "Since we implemented the order chatbot, our sales increased 40%. Customers can order anytime and we organize everything from the dashboard.",
    testimonial_1_name: "Carlos Mendoza",
    testimonial_1_role: "Owner, El Canario Restaurant",
    testimonial_2_text:
      "The automated reservation system changed our lives. We no longer lose bookings from missed calls. Everything is registered and confirmed automatically.",
    testimonial_2_name: "Ana Martínez",
    testimonial_2_role: "Manager, Plaza Hotel",
    testimonial_3_text:
      "I configured the chatbot in less than 10 minutes. Uploaded my menu in PDF and it's already serving customers. The customization with our colors looks perfect.",
    testimonial_3_name: "Luis Fernández",
    testimonial_3_role: "Owner, Central Café",

    // CTA
    cta_title: "Ready to create your chatbot?",
    cta_desc:
      "Join hundreds of businesses already automating their customer service",
    cta_primary: "Create Your Chatbot Free",
    cta_secondary: "Contact Sales",
    cta_note: "Free trial • No card required • Subdomain included",

    // Footer
    footer_about: "About Clonchat",
    footer_about_text:
      "Smart chatbot platform specialized in appointments and orders. RAG technology, custom subdomains and admin dashboard. Automate your business with accessible AI.",
    footer_links: "Links",
    footer_legal: "Legal",
    footer_privacy: "Privacy",
    footer_terms: "Terms",
    footer_contact: "Contact",
    footer_global: "Available globally",
    footer_rights: "All rights reserved.",

    // Contact Modal
    contact_title: "Contact Us",
    contact_desc: "Tell us about your needs. We'll reach out shortly.",
    contact_name_placeholder: "Your name",
    contact_email_placeholder: "Work email",
    contact_company_placeholder: "Company",
    contact_message_placeholder: "How can we help?",
    contact_cancel: "Cancel",
    contact_send: "Send email",
    contact_note: "Your message will be sent directly to our team",

    // Auth
    login_title: "Log In",
    login_subtitle: "Access your Clonchat account",
    register_title: "Create Account",
    register_subtitle: "Start creating your chatbot today",
    email_label: "Email",
    password_label: "Password",
    name_label: "Name (optional)",
    login_button: "Log In",
    register_button: "Sign Up",
    have_account: "Already have an account?",
    no_account: "Don't have an account?",
  },
};

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Dictionary) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");

  const t = (key: keyof Dictionary): string => {
    return dictionaries[locale][key];
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

