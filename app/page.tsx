import { Catalogue } from "@/components/catalogue";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Realisations } from "@/components/realisations";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <Catalogue />
      <Realisations />
      <Testimonials />
      <Contact />
      <SiteFooter />
    </main>
  );
}
