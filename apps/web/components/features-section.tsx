"use client";
import {
  Calendar,
  ShoppingCart,
  FileText,
  Globe,
  LayoutDashboard,
  Palette,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const features = [
  {
    icon: Calendar,
    titleKey: "feature_1_title",
    descKey: "feature_1_desc",
  },
  {
    icon: ShoppingCart,
    titleKey: "feature_2_title",
    descKey: "feature_2_desc",
  },
  {
    icon: FileText,
    titleKey: "feature_3_title",
    descKey: "feature_3_desc",
  },
  {
    icon: Globe,
    titleKey: "feature_4_title",
    descKey: "feature_4_desc",
  },
  {
    icon: LayoutDashboard,
    titleKey: "feature_5_title",
    descKey: "feature_5_desc",
  },
  {
    icon: Palette,
    titleKey: "feature_6_title",
    descKey: "feature_6_desc",
  },
];

export function FeaturesSection() {
  const { t } = useI18n();
  return (
    <section className="py-18 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("features_title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t("features_sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#2563eb]/30 group"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2563eb] transition-colors duration-300">
                  <Icon className="h-7 w-7 text-[#2563eb] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t(feature.titleKey as keyof typeof t)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(feature.descKey as keyof typeof t)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

