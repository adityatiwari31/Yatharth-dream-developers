"use client";

import { useEffect, useState } from "react";
import ManageVillas from "./ManageVillas";
import ManageReviews from "./ManageReviews";
import ManageEnquiries from "./ManageEnquiries";
import ManageNotices from "./ManageNotices";
import ManageFounders from "./ManageFounders";

const TABS = [
  { id: "villas", label: "Villas" },
  { id: "notices", label: "Upcoming bar" },
  { id: "reviews", label: "Reviews" },
  { id: "enquiries", label: "Enquiries" },
  { id: "founders", label: "Founders" },
] as const;
type Tab = (typeof TABS)[number]["id"];

/**
 * Owner's panel. The admin key is checked by the server on every request
 * (header x-admin-secret) and kept only in this browser tab's sessionStorage.
 */
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("villas");

  useEffect(() => {
    const saved = window.sessionStorage.getItem("ydd-admin-key");
    if (saved) {
      setAdminKey(saved);
      setUnlocked(true);
    }
  }, []);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    const key = adminKey.trim();
    if (!key) return;
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/enquiries", { headers: { "x-admin-secret": key }, cache: "no-store" });
      if (res.status === 401) {
        setError("That key was not accepted. Check for a stray space and try again.");
      } else if (!res.ok) {
        setError(`The server replied ${res.status}. Check the Vercel logs and that MONGODB_URI is set.`);
      } else {
        window.sessionStorage.setItem("ydd-admin-key", key);
        setAdminKey(key);
        setUnlocked(true);
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
  }

  function lock() {
    window.sessionStorage.removeItem("ydd-admin-key");
    setAdminKey("");
    setUnlocked(false);
  }

  if (!unlocked) {
    return (
      <div className="wrap section-pad">
        <form onSubmit={unlock} className="card mx-auto max-w-md p-6">
          <h1 className="!text-[1.6rem]">Admin</h1>
          <p className="mt-2 text-[0.92rem] text-muted">Enter the admin key (the ADMIN_SECRET value set in Vercel).</p>
          <label htmlFor="admin-key" className="label mt-5">
            Admin key
          </label>
          <input id="admin-key" type="password" className="input" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} autoComplete="current-password" />
          {error && (
            <p className="mt-3 rounded-xl bg-[#fbe6e2] px-4 py-3 text-[0.9rem] text-danger" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary mt-4 w-full" disabled={checking}>
            {checking ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="wrap section-pad !pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="!text-[1.8rem]">Admin</h1>
        <button type="button" onClick={lock} className="btn btn-outline !min-h-10 !px-4 !py-2 text-sm">
          Lock
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-2 text-[0.92rem] font-medium transition ${
              tab === t.id ? "border-ink bg-ink text-cream" : "border-line bg-card hover:border-brass"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "villas" && <ManageVillas adminKey={adminKey} />}
        {tab === "reviews" && <ManageReviews adminKey={adminKey} />}
        {tab === "enquiries" && <ManageEnquiries adminKey={adminKey} />}
        {tab === "notices" && <ManageNotices adminKey={adminKey} />}
        {tab === "founders" && <ManageFounders adminKey={adminKey} />}
      </div>
    </div>
  );
}
