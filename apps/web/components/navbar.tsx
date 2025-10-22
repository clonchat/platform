"use client";

import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/components/ui/contact-modal";
import { useI18n } from "@/lib/i18n";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const contact = useContactModal();
  const { locale, setLocale, t } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  const menuItems = [
    { label: t("nav_features"), href: "#features" },
    { label: t("nav_how_it_works"), href: "#how-it-works" },
    { label: t("nav_clients"), href: "#testimonials" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[9999] bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-[#2563eb]">
              Clonchat
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-[#2563eb] transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-gray-700 hover:text-[#2563eb] transition-colors font-medium"
            >
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
            </button>
            <Button
              onClick={() => contact.open()}
              variant="default"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            >
              {t("nav_contact")}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-700 hover:text-[#2563eb] transition-colors"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-[#2563eb] transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-gray-700 hover:text-[#2563eb] transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button
              onClick={() => {
                contact.open();
                setIsOpen(false);
              }}
              variant="default"
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            >
              {t("nav_contact")}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

