"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import { Search, ExternalLink, Copy, Check, Activity, Library } from "lucide-react";
import clsx from "clsx";
import { HelixAccent } from "@/components/three/HelixAccent";
import { TrustBar, OrcidIcon } from "@/components/TrustBar";
import { useSectionParallax } from "@/hooks/useSectionParallax";
import { fadeUp, scaleIn, staggerContainer, viewportOnce, duration, easing } from "@/lib/motion";

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Peer-Reviewed" | "Preprint" | "Case Report" | "Under Review">("All");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerParallax = useSectionParallax(headerRef);

  const filteredPublications = portfolioData.publications.filter((pub) => {
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.journal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || pub.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPubs = portfolioData.publications.length;
  const peerReviewedCount = portfolioData.publications.filter(p => p.type === "Peer-Reviewed").length;

  const trustBarItems = [
    {
      icon: <OrcidIcon className="h-6 w-6" />,
      label: "ORCID iD",
      value: portfolioData.personalInfo.orcid,
      href: `https://orcid.org/${portfolioData.personalInfo.orcid}`,
    },
    { icon: <Library className="h-6 w-6" />, label: "Total Publications", value: totalPubs },
    { icon: <Activity className="h-6 w-6" />, label: "Peer-Reviewed", value: peerReviewedCount },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* EXECUTIVE SUMMARY */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <HelixAccent />
        <motion.div
          ref={headerRef}
          style={{ y: headerParallax.y }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-6">
            <Library className="h-8 w-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-6">
            Clinical Research & Publications
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
            Dedicated to advancing evidence-based medicine through rigorous methodology, multicentric study coordination, and ICU registries. My research spans critical care outcomes, antimicrobial stewardship, and the integration of artificial intelligence in healthcare, maintaining strict adherence to GCP guidelines.
          </p>

          <TrustBar items={trustBarItems} className="justify-center" />
        </motion.div>
      </section>

      {/* INTERESTS GRID */}
      <section className="bg-white/5 dark:bg-slate-950/20 backdrop-blur-sm py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Lines of Inquiry</h2>
          </div>
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
          >
            {portfolioData.interests.map((interest, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                className="backdrop-blur-md bg-white/15 dark:bg-slate-950/30 px-5 py-3 rounded-full shadow-sm border border-white/10 dark:border-white/5 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:border-teal-500 dark:hover:border-teal-400 transition-all"
              >
                <Activity className="h-4 w-4 text-teal-500" />
                {interest}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FILTERABLE PUBLICATION DATABASE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Publication Registry</h2>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search publications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300/40 dark:border-slate-700/60 rounded-xl leading-5 bg-white/20 dark:bg-slate-850/40 text-slate-900 dark:text-slate-50 placeholder-slate-500/80 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 sm:text-sm transition-all outline-none"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {(["All", "Peer-Reviewed", "Preprint", "Case Report", "Under Review"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all border border-transparent",
                  activeTab === tab
                    ? "bg-teal-500/20 text-teal-750 dark:text-teal-400 border-teal-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-white/5"
                )}
              >
                {tab === "All" ? "All Publications" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Publication List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredPublications.map((pub, idx) => (
              <PublicationCard key={pub.id} publication={pub} index={idx} />
            ))}
            {filteredPublications.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-slate-500 dark:text-slate-400"
              >
                No publications found matching your criteria.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

function PublicationCard({ publication, index }: { publication: typeof portfolioData.publications[0], index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    // Generate AMA-style citation loosely
    const citation = `${publication.authors.join(", ")}. ${publication.title}. ${publication.journal}. ${publication.date}. ${publication.doi ? `doi:${publication.doi}` : ""}`.trim();
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderAuthors = (authors: string[]) => {
    return authors.map((author, i) => {
      // Check if string contains "Rahul Parajuli"
      const parts = author.split(/(Rahul Parajuli)/i);
      return (
        <span key={i}>
          {parts.map((part, j) => 
            part.toLowerCase() === "rahul parajuli" ? <strong key={j} className="text-slate-900 dark:text-slate-100">{part}</strong> : part
          )}
          {i < authors.length - 1 ? ", " : ""}
        </span>
      );
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: duration.fast, delay: index * 0.05, ease: easing.cinematicOut }}
      className="backdrop-blur-xl bg-white/20 dark:bg-slate-950/35 p-6 md:p-8 rounded-2xl border border-white/20 dark:border-white/10 hover:shadow-xl hover:shadow-teal-500/5 transition-all relative overflow-hidden group"
    >
      {/* Type Indicator */}
      <div className={clsx(
        "absolute top-0 right-0 px-4 py-1.5 text-xs font-bold rounded-bl-xl border-b border-l backdrop-blur-md",
        publication.type === "Peer-Reviewed" ? "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/20" :
        publication.type === "Preprint" ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20" :
        "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20"
      )}>
        {publication.type}
      </div>

      <div className="pr-24">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 leading-snug mb-2">
          {publication.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
          {renderAuthors(publication.authors)}
        </p>
        
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300 italic">{publication.journal}</span>
          <span>•</span>
          <span>{publication.date}</span>
          {publication.doi && (
            <>
              <span>•</span>
              <span className="font-mono text-xs">DOI: {publication.doi}</span>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {publication.link && (
            <a
              href={publication.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View Source
            </a>
          )}
          
          <button
            onClick={handleCopyCitation}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors relative"
          >
            {copied ? (
              <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                <Check className="w-4 h-4" /> Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Copy className="w-4 h-4" /> Copy Citation
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
