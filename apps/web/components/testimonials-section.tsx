"use client";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useI18n } from "@/lib/i18n";

export function TestimonialsSection() {
  const { t } = useI18n();

  const testimonials = [
    {
      quote: t("testimonial_1_text"),
      name: t("testimonial_1_name"),
      designation: t("testimonial_1_role"),
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop",
    },
    {
      quote: t("testimonial_2_text"),
      name: t("testimonial_2_name"),
      designation: t("testimonial_2_role"),
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop",
    },
    {
      quote: t("testimonial_3_text"),
      name: t("testimonial_3_name"),
      designation: t("testimonial_3_role"),
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("testimonials_title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t("testimonials_sub")}
          </p>
        </div>

        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </section>
  );
}

