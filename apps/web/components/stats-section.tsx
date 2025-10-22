"use client";
import { useI18n } from "@/lib/i18n";

export function StatsSection() {
  const { t } = useI18n();

  const stats = [
    {
      valueKey: "stat_1_value",
      labelKey: "stat_1_label",
    },
    {
      valueKey: "stat_2_value",
      labelKey: "stat_2_label",
    },
    {
      valueKey: "stat_3_value",
      labelKey: "stat_3_label",
    },
    {
      valueKey: "stat_4_value",
      labelKey: "stat_4_label",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {t(stat.valueKey as keyof typeof t)}
              </div>
              <div className="text-blue-100 text-sm md:text-base font-medium">
                {t(stat.labelKey as keyof typeof t)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

