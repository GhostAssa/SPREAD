import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { CHIP_BG } from "@/lib/chip-color";
import { getEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events — Spread",
  description: "What's happening at University of Ibadan, verified and on the record.",
};

const DELAYS: Array<"delay-100" | "delay-200" | undefined> = [undefined, "delay-100", "delay-200"];

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <SiteHeader />
      <main className="bg-sand py-[66px] md:py-[94px] px-[26px] relative overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="text-teal"
            d="M0,400 C320,200 420,600 720,400 C1020,200 1120,600 1440,400 L1440,800 L0,800 Z"
            fill="currentColor"
          />
        </svg>

        <div className="max-w-[1180px] mx-auto relative z-10">
          <Reveal as="div" className="mb-12">
            <span className="font-eyebrow text-eyebrow text-moss uppercase tracking-widest mb-4 inline-block bg-cream border-2 border-ink-band px-3 py-1 rounded-full shadow-ink-sm">
              On UI Campus
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band uppercase leading-none">
              Events
            </h1>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
            {events.map((event, i) => (
              <Reveal
                as="article"
                delay={DELAYS[i % DELAYS.length]}
                key={event.slug}
                className="fact-card bg-cream border-2 border-ink-band rounded-[16px] shadow-ink-md overflow-hidden"
              >
                <div className="p-4 border-b-2 border-ink-band bg-sand flex justify-between items-center">
                  <span
                    className={`${CHIP_BG[event.chipColor]} font-label-sm text-label-sm px-3 py-1 rounded-full border border-ink-band uppercase`}
                  >
                    {event.category}
                  </span>
                  <Icon name="event" className="text-ink-band" />
                </div>
                <div className="p-6">
                  <h3 className="font-note text-note text-ink-band mb-3">{event.title}</h3>
                  <p className="font-body-md text-body-md text-body-ink mb-6">{event.description}</p>
                  <div className="space-y-2 border-t border-ink-band/20 pt-4">
                    <div className="flex items-center gap-2 font-label-sm text-label-sm text-ink-band uppercase">
                      <Icon name="calendar_today" className="text-[16px]" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-label-sm text-label-sm text-ink-band uppercase">
                      <Icon name="place" className="text-[16px]" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
