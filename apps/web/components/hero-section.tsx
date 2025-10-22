"use client";

import { Button } from "@/components/ui/button";
import { useContactModal } from "@/components/ui/contact-modal";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Calendar, ShoppingCart, ArrowRight } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function HeroSection() {
  const contact = useContactModal();
  const { t } = useI18n();

  return (
    <section className="min-h-screen bg-white flex items-center relative overflow-hidden pt-20 md:pt-24">
      {/* Mobile-specific Lottie container */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden md:hidden">
        <div className="w-full h-full flex items-center justify-center px-4">
          <DotLottieReact
            src="/Chat Bot Test.lottie"
            loop
            autoplay
            speed={0.8}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "60vh",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
      {/* Desktop Lottie Animation */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden hidden md:block">
        <div className="w-full h-full flex items-center justify-center">
          <DotLottieReact
            src="/Chat Bot Test.lottie"
            loop
            autoplay
            speed={0.5}
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-8 md:py-0">
        <div className="text-center space-y-8 md:space-y-12">
          {/* Main Title - Google Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight">
              {t("hero_title_1")}
              <br />
              <span className="text-[#2563eb]">{t("hero_title_2")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
              {t("hero_desc")}
            </p>
          </motion.div>

          {/* CTA Button - Google Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-4 text-lg font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => contact.open()}
            >
              {t("hero_cta_primary")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Simple Feature Cards - Google Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8"
          >
            {/* Appointments Card */}
            <div className="group cursor-pointer">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:border-[#2563eb]/30">
                <div className="w-12 h-12 bg-[#2563eb]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2563eb]/20 transition-colors duration-300">
                  <Calendar className="h-6 w-6 text-[#2563eb]" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-3">
                  {t("hero_card_1_title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("hero_card_1_desc")}
                </p>
              </div>
            </div>

            {/* Orders Card */}
            <div className="group cursor-pointer">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:border-[#2563eb]/30">
                <div className="w-12 h-12 bg-[#2563eb]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2563eb]/20 transition-colors duration-300">
                  <ShoppingCart className="h-6 w-6 text-[#2563eb]" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-3">
                  {t("hero_card_2_title")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t("hero_card_2_desc")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
