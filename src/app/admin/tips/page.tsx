import Link from "next/link";
import { getTips } from "@/lib/tips";
import { AdminNav } from "@/components/admin/admin-nav";
import { TipRowActions } from "@/components/admin/tip-row-actions";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminTipsPage() {
  const tips = await getTips();

  return (
    <main className="min-h-screen bg-cream py-[66px] px-[26px]">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-start mb-2 flex-wrap gap-4">
          <div>
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-2 inline-block">
              Newsroom Admin
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile text-ink-band uppercase">
              Tips
            </h1>
          </div>
          <LogoutButton />
        </div>

        <AdminNav />

        <div className="bg-sand border-2 border-ink-band rounded-xl shadow-ink-md overflow-hidden divide-y-2 divide-dashed divide-ink-band/30">
          {tips.length === 0 && (
            <p className="p-6 font-body-md text-body-md text-body-ink">
              No tips submitted yet.
            </p>
          )}
          {tips.map((tip) => (
            <div className="p-5 flex items-start justify-between gap-4 flex-wrap" key={tip.id}>
              <div className="flex-1 min-w-[240px]">
                <p className="font-label-sm text-label-sm text-ink-band opacity-60 uppercase mb-2">
                  {tip.category || "General"} &middot; {tip.urgency || "Standard"} &middot;{" "}
                  {new Date(tip.receivedAt).toLocaleString()}
                </p>
                <p className="font-body-md text-body-md text-body-ink whitespace-pre-wrap">
                  {tip.message}
                </p>
                {tip.evidenceUrl && (
                  <Link
                    className="font-label-sm text-label-sm text-clay uppercase tracking-widest hover:underline mt-2 inline-block"
                    href={tip.evidenceUrl}
                    target="_blank"
                  >
                    View attached evidence
                  </Link>
                )}
              </div>
              <TipRowActions id={tip.id} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
