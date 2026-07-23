import { logout } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <section className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700">
              AuraBeads
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="h-10 rounded-[8px] border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Log out
            </button>
          </form>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <p className="text-sm font-medium text-slate-500">Signed in as</p>
            <h2 className="mt-2 text-2xl font-semibold">{user.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{user.email}</p>
          </div>
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Address</p>
            <p className="mt-2 text-sm leading-6 text-slate-800">
              {user.address}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
