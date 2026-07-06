"use client";

import { motion } from "framer-motion";
import { ExternalLink, Activity } from "lucide-react";
import { portfolioData } from "@/data/portfolioData";

export default function BlogPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-transparent">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/20 dark:bg-slate-950/35 rounded-2xl border border-white/20 dark:border-white/10 shadow-lg p-8 sm:p-10 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-6">
            <Activity className="h-8 w-8 text-teal-600 dark:text-teal-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Blog &amp; Updates
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            I share clinical research updates, conference takeaways, and career milestones on LinkedIn.
            Follow along there for my latest posts.
          </p>

          <a
            href={portfolioData.personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-medium shadow-md shadow-teal-600/10 hover:shadow-teal-500/20 hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            View My Posts on LinkedIn
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
