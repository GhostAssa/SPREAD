"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { label: "Articles", href: "/admin" },
  { label: "Tips", href: "/admin/tips" },
  { label: "Users", href: "/admin/users" },
  { label: "Submissions", href: "/admin/submissions" },
  { label: "Settings", href: "/admin/settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 font-eyebrow text-eyebrow uppercase tracking-widest mb-8 border-b-2 border-ink-band pb-3">
      {SECTIONS.map((section) => {
        const isActive = pathname === section.href;
        return (
          <Link
            key={section.href}
            href={section.href}
            className={
              isActive
                ? "text-clay border-b-2 border-clay pb-1 -mb-[13px]"
                : "text-ink-band opacity-70 hover:opacity-100"
            }
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
