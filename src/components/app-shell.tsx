"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { FitlogProvider, useFitlog } from "@/context/fitlog-context";

function ShellContent({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { plan, saved, toast } = useFitlog();
  const [menuOpen, setMenuOpen] = useState(false);
  const isPlan = path === "/my-plan";

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="FitLog home"><span className="brand-mark"><Dumbbell size={19} strokeWidth={2.8} /></span><span>FIT<span>LOG</span></span></Link>
          <button className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          <nav className={menuOpen ? "main-nav nav-open" : "main-nav"} aria-label="Main navigation">
            <Link className={!isPlan ? "nav-link active" : "nav-link"} href="/#library" onClick={() => setMenuOpen(false)}>Workout</Link>
            <Link className={isPlan ? "nav-link active" : "nav-link"} href="/my-plan" onClick={() => setMenuOpen(false)}>My Plan</Link>
          </nav>
          <div className="header-badges">
            <Link className="count-badge plan-badge" href="/my-plan"><span>PLAN</span><strong>{plan.length}</strong></Link>
            <Link className="count-badge saved-badge" href="/my-plan?tab=saved"><span>SAVED</span><strong>{saved.length}</strong></Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer"><Link className="brand footer-brand" href="/"><span className="brand-mark"><Dumbbell size={18} strokeWidth={2.8} /></span><span>FIT<span>LOG</span></span></Link><p>© 2026 FitLog — Workout Library. Train hard, log honest.</p></footer>
      {toast && <div className="toast" role="status"><span className="toast-icon"><Check size={15} /></span>{toast}</div>}
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return <FitlogProvider><ShellContent>{children}</ShellContent></FitlogProvider>;
}