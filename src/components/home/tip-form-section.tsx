import { Reveal } from "@/components/reveal";
import { TipForm } from "@/components/tip-form";

export function TipFormSection() {
  return (
    <section className="bg-ink-band py-[66px] md:py-[94px] px-[26px] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90%" cy="10%" fill="#7C3055" r="300" style={{ filter: "blur(80px)" }} />
          <circle cx="10%" cy="90%" fill="#106969" r="200" style={{ filter: "blur(60px)" }} />
        </svg>
      </div>

      <Reveal
        as="div"
        className="max-w-[800px] mx-auto relative z-10 bg-cream border-[3px] border-ink-band rounded-2xl shadow-ink-lg p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-4 inline-block bg-sand border-2 border-ink-band px-3 py-1 rounded-full shadow-ink-sm">
            Anonymous &amp; Secure
          </span>
          <h2 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band uppercase leading-none mb-4">
            Drop a Tip
          </h2>
          <p className="font-body-lg text-body-lg text-body-ink">
            Heard something? Got receipts? Send it our way. We protect our sources.
          </p>
        </div>
        <TipForm />
      </Reveal>
    </section>
  );
}
