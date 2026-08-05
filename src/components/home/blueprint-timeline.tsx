import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";

type Step = {
  n: string;
  title: string;
  body: string;
  icon: string;
  dotColor: string;
  cardBg: string;
  numColor: string;
  side: "left" | "right";
  delay?: "delay-100" | "delay-200" | "delay-300";
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "The Drop",
    body: "A student, staff member, or anonymous source submits a tip, rumor, or document through our secure channel.",
    icon: "inbox",
    dotColor: "bg-amber",
    cardBg: "bg-sand",
    numColor: "text-clay/20",
    side: "left",
  },
  {
    n: "02",
    title: "The Chase",
    body: "Our reporters investigate. We cross-reference claims with official documents, interview primary sources, and verify digital footprints.",
    icon: "search",
    dotColor: "bg-teal",
    cardBg: "bg-surface-container-high",
    numColor: "text-teal/20",
    side: "right",
    delay: "delay-100",
  },
  {
    n: "03",
    title: "The Sieve",
    body: "Editorial review. If a claim cannot be substantiated with hard evidence or named sources, it is marked as unverified or debunked.",
    icon: "filter_alt",
    dotColor: "bg-pink",
    cardBg: "bg-error-container",
    numColor: "text-error/20",
    side: "left",
    delay: "delay-200",
  },
  {
    n: "04",
    title: "The Broadcast",
    body: "The truth goes live. Clear, cited, and accessible to the entire University of Ibadan community without paywalls or censorship.",
    icon: "campaign",
    dotColor: "bg-moss",
    cardBg: "bg-sand-deep",
    numColor: "text-moss/20",
    side: "right",
    delay: "delay-300",
  },
];

export function BlueprintTimeline() {
  return (
    <section className="bg-cream py-[66px] md:py-[94px] px-[26px] relative">
      <div className="max-w-[1180px] mx-auto">
        <Reveal as="div" className="text-center mb-16">
          <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-4 inline-block border-b-2 border-clay pb-1">
            Our Methodology
          </span>
          <h2 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band uppercase">
            The Blueprint of
            <br />
            Truth-Finding
          </h2>
          <p className="font-body-lg text-body-lg text-body-ink max-w-2xl mx-auto mt-6">
            We don&apos;t just repeat what we hear. Every tip goes through a rigorous,
            transparent process before it hits the broadcast.
          </p>
        </Reveal>

        <div className="relative timeline-line pt-8 pb-8">
          {STEPS.map((step) => (
            <Reveal
              as="div"
              key={step.n}
              delay={step.delay}
              className="relative z-10 flex flex-col md:flex-row items-center mb-16 md:mb-24 last:mb-0"
            >
              {step.side === "left" ? (
                <>
                  <div className="md:w-1/2 flex justify-start md:justify-end md:pr-12 w-full pl-16 md:pl-0 mb-4 md:mb-0">
                    <div className={`${step.cardBg} border-2 border-ink-band p-6 rounded-xl shadow-ink-md max-w-md w-full relative`}>
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream border-2 border-ink-band rounded-full hidden md:block" />
                      <span className={`font-shout-lg-mobile text-[40px] ${step.numColor} absolute -top-6 -left-4`}>
                        {step.n}
                      </span>
                      <h3 className="font-note text-note text-ink-band mb-2 relative z-10">
                        {step.title}
                      </h3>
                      <p className="font-body-md text-body-md text-body-ink">{step.body}</p>
                    </div>
                  </div>
                  <StepDot dotColor={step.dotColor} icon={step.icon} />
                  <div className="md:w-1/2 w-full hidden md:block" />
                </>
              ) : (
                <>
                  <div className="md:w-1/2 w-full hidden md:block" />
                  <StepDot dotColor={step.dotColor} icon={step.icon} />
                  <div className="md:w-1/2 flex justify-start md:justify-start md:pl-12 w-full pl-16 md:pl-0 mt-4 md:mt-0">
                    <div className={`${step.cardBg} border-2 border-ink-band p-6 rounded-xl shadow-ink-md max-w-md w-full relative`}>
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream border-2 border-ink-band rounded-full hidden md:block" />
                      <span className={`font-shout-lg-mobile text-[40px] ${step.numColor} absolute -top-6 -right-4`}>
                        {step.n}
                      </span>
                      <h3 className="font-note text-note text-ink-band mb-2 relative z-10">
                        {step.title}
                      </h3>
                      <p className="font-body-md text-body-md text-body-ink">{step.body}</p>
                    </div>
                  </div>
                </>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepDot({ dotColor, icon }: { dotColor: string; icon: string }) {
  return (
    <div
      className={`absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 w-12 h-12 ${dotColor} border-4 border-ink-band rounded-full flex items-center justify-center ml-[6px] md:ml-0`}
    >
      <Icon name={icon} className="text-ink-band" />
    </div>
  );
}
