import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-cream py-[66px] px-[26px]">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-start mb-2 flex-wrap gap-4">
          <div>
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-2 inline-block">
              Newsroom Admin
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile text-ink-band uppercase">
              Settings
            </h1>
          </div>
          <LogoutButton />
        </div>

        <AdminNav />

        <SettingsForm initial={settings} />
      </div>
    </main>
  );
}
