import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { LogoutLink } from "@/components/account/logout-link";
import { Icon } from "@/components/icon";
import { getCurrentUser } from "@/lib/session";
import { countCommentsByUser } from "@/lib/comments";
import { countBookmarks } from "@/lib/bookmarks";
import { countTipsByUser } from "@/lib/tips";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [commentCount, bookmarkCount, tipCount] = await Promise.all([
    countCommentsByUser(user.id),
    countBookmarks(user.id),
    countTipsByUser(user.id),
  ]);

  const stats = [
    { label: "Comments Made", value: commentCount, icon: "forum", color: "text-teal" },
    { label: "Bookmarks Saved", value: bookmarkCount, icon: "bookmark", color: "text-amber" },
    { label: "Tips Submitted", value: tipCount, icon: "campaign", color: "text-clay" },
  ];

  return (
    <>
      <SiteHeader />
      <main className="bg-cream py-[66px] md:py-[94px] px-[26px] min-h-[70vh]">
        <div className="max-w-[800px] mx-auto space-y-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-2 inline-block">
                Welcome back
              </span>
              <h1 className="font-headline-h2-mobile text-headline-h2-mobile text-ink-band uppercase">
                {user.name}
              </h1>
            </div>
            <LogoutLink />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div
                className="bg-cream border-2 border-ink-band rounded-xl shadow-ink-md p-6 text-center"
                key={stat.label}
              >
                <Icon name={stat.icon} className={`text-[32px] ${stat.color} mb-2`} />
                <p className="font-shout-lg-mobile text-[40px] text-ink-band leading-none mb-2">
                  {stat.value}
                </p>
                <p className="font-eyebrow text-eyebrow text-ink-band uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
