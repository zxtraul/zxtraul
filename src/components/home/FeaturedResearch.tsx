"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { portfolioData } from "@/data/portfolioData";
import { fadeUp, viewportOnce } from "@/lib/motion";

/**
 * Bridges Home -> Research with a single highlighted publication, so the
 * "Academic & Research" claim in Executive Overview has visible evidence
 * before the reviewer reaches the full career-history timeline. Picks the
 * most notable real entry from portfolioData (prefers Peer-Reviewed, falls
 * back to the first publication) — no fabricated content.
 */
export function FeaturedResearch() {
  const featured =
    portfolioData.publications.find((pub) => pub.type === "Peer-Reviewed") ??
    portfolioData.publications[0];

  if (!featured) return null;

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="glass-card rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center"
        >
          <div className="w-14 h-14 shrink-0 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center">
            <BookOpen className="h-7 w-7 text-teal-600 dark:text-teal-400" />
          </div>

          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Featured Research
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 leading-snug mb-2">
              {featured.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="italic">{featured.journal}</span> &bull; {featured.date}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <a
              href="/research"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
            >
              View Full Registry <ArrowRight className="w-4 h-4" />
            </a>
            {featured.link && (
              <a
                href={featured.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 border border-white/20 dark:border-slate-800/60 text-slate-900 dark:text-slate-50 rounded-xl text-sm font-medium transition-all"
              >
                View Source <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
