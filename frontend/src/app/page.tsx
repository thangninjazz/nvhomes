import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ProjectsSection } from "@/components/landing/projects-section"
import { ProcessSection } from "@/components/landing/process-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"
import { FloatingCTA } from "@/components/landing/floating-cta"

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ProjectsSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
      <FloatingCTA />
    </main>
  )
}
