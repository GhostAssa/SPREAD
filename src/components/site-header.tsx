"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { NAV_ITEMS } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/news?q=${encodeURIComponent(q)}` : "/news");
  }

  return (
    <header className="bg-cream border-b-2 border-ink-band w-full sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-[1180px] mx-auto px-[26px] py-4 gap-6">
        <Link
          href="/"
          className="font-headline-h2-mobile font-bold text-[28px] md:text-[34px] text-ink-band tracking-tight shrink-0 leading-none"
        >
          Spread
        </Link>

        <nav className="hidden lg:flex gap-8 items-center font-eyebrow text-eyebrow uppercase tracking-widest">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "text-clay font-bold border-b-2 border-clay pb-1"
                    : "text-ink-band opacity-80 hover:text-plum transition-transform hover:-translate-y-0.5"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <form
            className="hidden xl:flex items-center bg-sand border-2 border-ink-band rounded-full px-4 py-1 shadow-ink-sm focus-within:border-plum"
            onSubmit={handleSearch}
          >
            <button aria-label="Search" className="text-ink-band mr-2" type="submit">
              <Icon name="search" />
            </button>
            <input
              className="bg-transparent border-none focus:outline-none text-label-sm font-label-sm w-32 placeholder:text-on-surface-variant"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              type="text"
              value={query}
            />
          </form>
          <Link
            href="/newsletter"
            className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band whitespace-nowrap"
          >
            Join Newsletter
          </Link>
        </div>
      </div>
    </header>
  );
}
