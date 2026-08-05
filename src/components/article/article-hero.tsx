import Image from "next/image";

type ArticleHeroProps = {
  imageUrl?: string;
  imageAlt: string;
};

export function ArticleHero({ imageUrl, imageAlt }: ArticleHeroProps) {
  if (!imageUrl) return null;

  return (
    <section className="w-full relative bg-ink-band pt-8 pb-16">
      <div className="max-w-[1180px] mx-auto px-[26px] relative z-10">
        <div className="rounded-[22px] shadow-ink-lg border-2 border-ink-band overflow-hidden bg-sand relative h-[60vh] md:h-[70vh]">
          <Image alt={imageAlt} className="object-cover" fill priority sizes="100vw" src={imageUrl} />
          <div className="absolute inset-0 scanlines pointer-events-none" />
          <svg
            className="absolute top-4 right-4 w-12 h-12 text-cream"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 8l8-4 8 4M12 4v16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
