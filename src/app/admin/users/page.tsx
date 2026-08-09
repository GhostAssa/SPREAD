import { getUsers } from "@/lib/users";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { UserRowActions } from "@/components/admin/user-row-actions";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <main className="min-h-screen bg-cream py-[66px] px-[26px]">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-start mb-2 flex-wrap gap-4">
          <div>
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-2 inline-block">
              Newsroom Admin
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile text-ink-band uppercase">
              Users
            </h1>
          </div>
          <LogoutButton />
        </div>

        <AdminNav />

        <div className="bg-sand border-2 border-ink-band rounded-xl shadow-ink-md overflow-hidden divide-y-2 divide-dashed divide-ink-band/30">
          {users.length === 0 && (
            <p className="p-6 font-body-md text-body-md text-body-ink">No users yet.</p>
          )}
          {users.map((user) => (
            <div className="p-5 flex items-center justify-between gap-4 flex-wrap" key={user.id}>
              <div>
                <p className="font-note text-note text-ink-band text-lg">{user.name}</p>
                <p className="font-label-sm text-label-sm text-ink-band opacity-60 uppercase">
                  {user.email} &middot; Wallet: &#8358;{user.walletBalanceNaira.toLocaleString()} &middot;{" "}
                  <span className={user.subscribed ? "text-moss" : "text-error"}>
                    {user.subscribed ? "Active" : "Not Active"}
                  </span>
                </p>
              </div>
              <UserRowActions subscribed={user.subscribed} userId={user.id} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
