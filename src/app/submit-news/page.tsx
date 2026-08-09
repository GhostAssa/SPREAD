import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Reveal } from "@/components/reveal";
import { SubmitNewsForm } from "@/components/submit-news-form";
import { getCurrentUser } from "@/lib/session";

export default async function SubmitNewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <SiteHeader />
      <main className="bg-ink-band py-[66px] md:py-[94px] px-[26px] min-h-[70vh]">
        <Reveal
          as="div"
          className="max-w-[700px] mx-auto bg-cream border-[3px] border-ink-band rounded-2xl shadow-ink-lg p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-4 inline-block bg-sand border-2 border-ink-band px-3 py-1 rounded-full shadow-ink-sm">
              Spread &amp; Earn
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band uppercase leading-none mb-4">
              Submit News
            </h1>
            <p className="font-body-lg text-body-lg text-body-ink">
              Our AI screens every submission for coherence, evidence, and originality before it
              publishes. Verified stories earn you a payout instantly.
            </p>
          </div>

          {user.subscribed ? (
            <SubmitNewsForm />
          ) : (
            <div className="text-center bg-error-container border-2 border-ink-band rounded-xl p-8">
              <p className="font-note text-note text-on-error-container mb-4">
                You need an active verification package to submit news.
              </p>
              <Link
                className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band inline-block"
                href="/account"
              >
                Go to Your Account
              </Link>
            </div>
          )}
        </Reveal>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
