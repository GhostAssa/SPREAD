"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";

const ITEMS = [
  { label: "Home", href: "/", icon: "live_tv" },
  { label: "News", href: "/news", icon: "notifications_active" },
  { label: "Events", href: "/events", icon: "settings_input_antenna" },
  { label: "Tip", href: "/share-a-news", icon: "account_circle" },
] as const;

/** Fixed bottom nav, ported from the article template — mobile only. */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 lg:hidden bg-ink-band rounded-t-xl border-t-2 border-clay shadow-[0px_-4px_10px_rgba(0,0,0,0.3)]">
      {ITEMS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "flex flex-col items-center justify-center bg-clay text-cream rounded-xl p-2 w-16"
                : "flex flex-col items-center justify-center text-sand-deep p-2 hover:text-primary-fixed-dim w-16"
            }
          >
            <Icon name={item.icon} className="text-[24px] mb-1" />
            <span className="text-label-sm font-label-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
