"use client";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/components/ui/contact-modal";
import { useI18n } from "@/lib/i18n";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function CTASection() {
  const contact = useContactModal();
  const { t } = useI18n();

  return (
    <section className="py-20 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />

      {/* Lottie Animation - Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-96 lg:w-[500px] opacity-20 md:opacity-30 pointer-events-none">
        <DotLottieReact
          src="/Businessman flies up with rocket.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          {t("cta_title")}
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {t("cta_desc")}
        </p>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => contact.open()}
            className="bg-white text-[#2563eb] hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200"
          >
            {t("cta_primary")}
          </Button>
        </div>

        <p className="mt-8 text-blue-100 text-sm">{t("cta_note")}</p>
      </div>
    </section>
  );
}

