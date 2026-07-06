import type { ReactNode } from "react";
import clsx from "clsx";

/** Same ORCID mark used elsewhere on the site (Footer, Research page). */
export function OrcidIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={clsx("fill-current", className)}>
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
  );
}

export interface TrustBarItem {
  icon: ReactNode;
  label: string;
  /** Omit for a simple icon+label badge; provide for an icon+stat display. */
  value?: string | number;
  href?: string;
}

const badgeClasses =
  "flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-xl shadow-sm border border-white/20 dark:border-slate-800/40";

const statClasses =
  "flex items-center gap-3 px-5 py-3 backdrop-blur-xl bg-white/10 dark:bg-slate-900/10 rounded-xl border border-white/20 dark:border-white/10 shadow-md hover:shadow-md hover:shadow-teal-500/5 transition-all";

/**
 * Shared credibility strip — used on Home (below the hero) and Research
 * (its existing ORCID/publication-count badges) so the same visual
 * language for "proof" carries across pages. Every value here is sourced
 * straight from portfolioData; this component only changes presentation.
 */
export function TrustBar({ items, className }: { items: TrustBarItem[]; className?: string }) {
  return (
    <div className={clsx("flex flex-wrap gap-3", className)}>
      {items.map((item, idx) => {
        if (item.value === undefined) {
          const content = (
            <>
              {item.icon}
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
            </>
          );
          return item.href ? (
            <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" className={badgeClasses}>
              {content}
            </a>
          ) : (
            <div key={idx} className={badgeClasses}>
              {content}
            </div>
          );
        }

        const content = (
          <>
            <div className="text-teal-600 dark:text-teal-400">{item.icon}</div>
            <div className="text-left">
              <div className="text-xs text-slate-500 font-medium">{item.label}</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">{item.value}</div>
            </div>
          </>
        );
        return item.href ? (
          <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" className={clsx(statClasses, "group")}>
            {content}
          </a>
        ) : (
          <div key={idx} className={statClasses}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
