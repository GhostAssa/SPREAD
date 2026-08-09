import { getSubmissions } from "@/lib/submissions";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { SubmissionRowActions } from "@/components/admin/submission-row-actions";

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <main className="min-h-screen bg-cream py-[66px] px-[26px]">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-start mb-2 flex-wrap gap-4">
          <div>
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-2 inline-block">
              Newsroom Admin
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile text-ink-band uppercase">
              Submissions
            </h1>
          </div>
          <LogoutButton />
        </div>

        <AdminNav />

        <div className="bg-sand border-2 border-ink-band rounded-xl shadow-ink-md overflow-hidden divide-y-2 divide-dashed divide-ink-band/30">
          {submissions.length === 0 && (
            <p className="p-6 font-body-md text-body-md text-body-ink">No submissions yet.</p>
          )}
          {submissions.map((s) => (
            <div className="p-5 flex items-start justify-between gap-4 flex-wrap" key={s.id}>
              <div className="max-w-[600px]">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-note text-note text-ink-band text-lg">{s.title}</p>
                  <span
                    className={
                      s.status === "verified"
                        ? "font-label-sm text-label-sm uppercase px-2 py-1 rounded bg-tertiary-container text-on-tertiary-container border border-ink-band"
                        : "font-label-sm text-label-sm uppercase px-2 py-1 rounded bg-error-container text-on-error-container border border-ink-band"
                    }
                  >
                    {s.status}
                  </span>
                  {s.overriddenByAdmin && (
                    <span className="font-label-sm text-label-sm uppercase px-2 py-1 rounded bg-primary-fixed text-on-primary-fixed border border-ink-band">
                      Overridden
                    </span>
                  )}
                </div>
                <p className="font-label-sm text-label-sm text-ink-band opacity-60 uppercase mb-2">
                  By {s.authorName} &middot; {new Date(s.submittedAt).toLocaleString()}
                  {s.status === "verified" && ` · ₦${s.payoutNaira.toLocaleString()}`}
                </p>
                <p className="font-body-md text-body-md text-body-ink mb-1">
                  <strong>AI reason:</strong> {s.aiReason}
                </p>
                {s.evidenceNote && (
                  <p className="font-body-md text-body-md text-body-ink opacity-80">
                    <strong>Evidence note:</strong> {s.evidenceNote}
                  </p>
                )}
              </div>
              <SubmissionRowActions status={s.status} submissionId={s.id} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
