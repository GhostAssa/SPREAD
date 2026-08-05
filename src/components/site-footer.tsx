import { Reveal } from "@/components/reveal";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full relative overflow-hidden bg-ink-band">
      <Reveal
        as="div"
        className="flex flex-col md:flex-row justify-between items-center max-w-[1180px] mx-auto px-[26px] py-[66px] md:py-[94px]"
      >
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <span className="font-headline-h2-mobile text-headline-h2-mobile text-clay block mb-2">
            Spread
          </span>
          <span className="font-label-sm text-label-sm text-sand">
            &copy; {year} SPREAD — UNIVERSITY OF IBADAN BROADCAST · LAGOS LO-FI ARCHIVE
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 font-label-sm text-label-sm text-sand opacity-60">
          <a className="hover:text-primary-fixed transition-colors" href="/news">
            News
          </a>
          <a className="hover:text-primary-fixed transition-colors" href="/events">
            Events
          </a>
          <a className="hover:text-primary-fixed transition-colors" href="/contact-us">
            Contact Us
          </a>
          <a className="hover:text-primary-fixed transition-colors" href="/share-a-news">
            Share a News
          </a>
        </nav>
      </Reveal>
    </footer>
  );
}
