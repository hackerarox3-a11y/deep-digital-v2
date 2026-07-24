import { Catalogue } from "@/components/catalogue";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Studio } from "@/components/studio/studio";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return <main><SiteHeader /><Hero /><Catalogue /><Studio /><Testimonials /><Contact /><SiteFooter /></main>;
}
