import { Splash } from "@/widgets/splash";
import { Navbar } from "@/widgets/navbar";
import { Hero } from "@/widgets/hero";
import { OurStory } from "@/widgets/our-story";
import { Timeline } from "@/widgets/timeline";
import { Location } from "@/widgets/location";
import { DressCode } from "@/widgets/dress-code";
import { Gifts } from "@/widgets/gifts";
import { RSVP } from "@/widgets/rsvp";
import { Footer } from "@/widgets/footer";

export default function Home() {
  return (
    <>
      <Splash />
      <Navbar />
      <main className="relative">
        <Hero />
        <OurStory />
        <Timeline />
        <Location />
        <DressCode />
        <Gifts />
        <RSVP />
      </main>
      <Footer />
    </>
  );
}
