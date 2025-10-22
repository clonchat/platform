import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { StatsSection } from "@/components/stats-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <HeroSection />
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        <section id="features">
          <FeaturesSection />
        </section>
        <StatsSection />
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <CTASection />
        <Footer />
      </main>
    </>
  );
}

