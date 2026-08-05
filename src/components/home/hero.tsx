import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="relative min-h-[700px] md:min-h-[921px] bg-sand overflow-hidden px-[26px] py-[66px] md:py-[94px] flex items-center justify-center">
      <svg
        className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="text-clay"
          d="M0,500 Q250,200 500,500 T1000,500"
          fill="none"
          stroke="currentColor"
          strokeWidth="40"
        />
        <circle className="text-plum" cx="200" cy="800" fill="currentColor" r="100" />
        <rect
          className="text-moss"
          fill="currentColor"
          height="150"
          transform="rotate(45 875 175)"
          width="150"
          x="800"
          y="100"
        />
      </svg>

      <div className="max-w-[1180px] w-full mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-[40px]">
        <Reveal as="div" className="md:col-span-7 flex flex-col justify-center">
          <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-4 inline-block bg-cream border-2 border-ink-band px-3 py-1 w-max rounded-full shadow-ink-sm">
            University of Ibadan&apos;s Source of Truth
          </span>
          <h1 className="font-shout-lg-mobile text-shout-lg-mobile md:font-shout-lg md:text-shout-lg text-ink-band leading-none mb-6">
            HUMAN
            <br />
            VERIFIED
            <br />
            BROADCAST.
          </h1>
          <p className="font-body-lg text-body-lg text-body-ink max-w-md mb-8 border-l-4 border-amber pl-4">
            The unfiltered pulse of the University of Ibadan. We separate the noise from the
            facts — starting right here, before it spreads everywhere else.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/news"
              className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-4 rounded-full text-ink-band"
            >
              Read Latest
            </Link>
            <Link
              href="/share-a-news"
              className="bg-cream border-2 border-ink-band font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-4 rounded-full text-ink-band shadow-ink-sm hover:-translate-y-0.5 transition-transform"
            >
              Submit Fact
            </Link>
          </div>
        </Reveal>

        <Reveal as="div" delay="delay-200" className="md:col-span-5 relative mt-12 md:mt-0">
          <div className="bg-sand-deep border-[3px] border-ink-band rounded-[22px] shadow-ink-lg p-2 absolute top-0 right-0 w-3/4 z-20 rotate-3">
            <div className="bg-ink-band rounded-[13px] h-64 overflow-hidden scanlines relative">
              <Image
                alt="A gritty, high-contrast black and white photograph of students gathered around a notice board on a brutalist university campus."
                className="object-cover mix-blend-luminosity opacity-80"
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEnGoxmqqPo9yvYJut49A2FbYtV2-qkBdu2jP9QrTZ0wos96dS3E5NLIzVMVf9wB1kgT0y2sa5oDbkxcs2zQcJ5AUuSaEj49HLk-ggSNa8RIRBuSRJu6D_y9pxDSk7z5Uc1ndNzCRzjj5UfL4WfvGBFtuuPTDPN48wt-26yp86N0WgolYDXqdZ6W2EiNJjoCT2oXhzHOZmHbYE2GvIBOr-lWpjSXpfhZ60St0BKumQB_ujtGMCE4s"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <span className="w-3 h-3 rounded-full bg-error border border-ink-band" />
                <span className="font-label-sm text-label-sm text-error bg-cream px-1 uppercase">
                  REC
                </span>
              </div>
            </div>
          </div>

          <div className="bg-cream border-2 border-ink-band p-4 shadow-ink-md rounded-lg absolute bottom-10 left-0 w-2/3 z-30 -rotate-2">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="verified" className="text-moss" />
              <h3 className="font-note text-note text-ink-band">Fact Check</h3>
            </div>
            <p className="font-body-md text-body-md text-body-ink">
              Hostel D renovation funds have been approved by the VC office.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
