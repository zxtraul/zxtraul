"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp, viewportOnce } from "@/lib/motion";

interface ClosingCTAProps {
  onOpenCVModal: () => void;
}

/**
 * Terminal action before the footer — reuses the existing CV-request modal
 * trigger and the #contact anchor already valid on Footer.tsx, just gives
 * the page a clear closing beat instead of trailing straight into the
 * footer after Humanitarian Footprint.
 */
export function ClosingCTA({ onOpenCVModal }: ClosingCTAProps) {
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4 drop-shadow-lg">
            Let&apos;s Connect
          </h2>
          <p className="text-slate-600 dark:text-slate-200 mb-8 font-medium max-w-xl mx-auto">
            For a complete look at credentials, publications, and clinical experience, request the
            full CV or reach out directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onOpenCVModal}
              className="px-8 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-medium shadow-md shadow-teal-600/10 hover:shadow-teal-500/20 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Request Professional CV
            </button>
            <Link
              href="/#contact"
              className="px-8 py-3.5 backdrop-blur-md bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 text-slate-900 dark:text-slate-50 border border-white/25 dark:border-slate-800/60 rounded-xl font-medium shadow-sm transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
