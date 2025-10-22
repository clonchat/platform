"use client";
import { UserPlus, Settings, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const steps = [
  {
    icon: UserPlus,
    titleKey: "how_step_1_title",
    descKey: "how_step_1_desc",
  },
  {
    icon: Settings,
    titleKey: "how_step_2_title",
    descKey: "how_step_2_desc",
  },
  {
    icon: Rocket,
    titleKey: "how_step_3_title",
    descKey: "how_step_3_desc",
  },
];

export function HowItWorksSection() {
  const { t } = useI18n();
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("how_title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t("how_sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#2563eb] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mt-12 flex justify-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-10 w-10 text-[#2563eb]" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t(step.titleKey as keyof typeof t)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(step.descKey as keyof typeof t)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

