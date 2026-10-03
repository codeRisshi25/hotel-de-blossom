import { useEffect, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "../ui/button";
import { configured, supabase } from "../../lib/staff-api";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (supabase) void supabase.auth.getSession().then(({ data }) => { if (data.session) window.location.replace("/staff"); }); }, []);
  const signIn = async (event: { preventDefault(): void }) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) { setError(authError.message); return; }
    const next = new URLSearchParams(window.location.search).get("next") || "/staff";
    window.location.assign(next.startsWith("/") ? next : "/staff");
  };
  return <main className="staff-grid grid min-h-screen place-items-center bg-[var(--champagne)] px-5 py-10">
    <section className="reveal w-full max-w-[440px] border border-[rgba(184,135,46,.45)] bg-[var(--ivory)] p-7 shadow-[0_22px_70px_rgba(13,40,35,.12)] sm:p-10">
      <div className="mb-10 flex items-center justify-between"><img src="/images/logo-optimized.png" width="52" height="52" alt="Hotel De Blossom" className="h-12 w-12 object-contain" /><span className="font-mono text-[10px] uppercase tracking-[.18em] text-[var(--forest)]">Staff access</span></div>
      <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--gold)]">Hotel De Blossom</p>
      <h1 className="mt-2 font-[var(--font-display)] text-5xl font-medium leading-none text-[var(--forest)]">The front desk,<br /><em>considered.</em></h1>
      <p className="mt-5 max-w-sm text-sm leading-6 text-[rgba(23,24,21,.7)]">Sign in with your approved staff account to manage enquiries, guest follow-ups, and room rates.</p>
      {!configured ? <p className="mt-7 border border-red-200 bg-red-50 p-3 text-sm text-red-900">Missing public Supabase configuration. Add <code>PUBLIC_SUPABASE_URL</code> and <code>PUBLIC_SUPABASE_ANON_KEY</code>.</p> : <form onSubmit={signIn} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-xs font-bold text-[var(--forest)]">Work email<input required autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-11 border border-[rgba(22,56,49,.22)] bg-[var(--champagne)] px-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(184,135,46,.2)]" /></label>
        <label className="grid gap-2 text-xs font-bold text-[var(--forest)]">Password<input required autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="min-h-11 border border-[rgba(22,56,49,.22)] bg-[var(--champagne)] px-3 text-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(184,135,46,.2)]" /></label>
        {error && <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>}
        <Button type="submit" disabled={busy} variant="gold" className="mt-2 w-full">{busy ? "Signing you in…" : <>Sign in securely <ArrowRight size={16} /></>}</Button>
      </form>}
      <p className="mt-8 flex items-center gap-2 text-xs text-[rgba(23,24,21,.55)]"><LockKeyhole size={13} /> Restricted to active Hotel De Blossom staff.</p>
    </section>
  </main>;
}
