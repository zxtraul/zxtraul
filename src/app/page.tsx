"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { portfolioData } from "@/data/portfolioData";
import { MapPin, Award, Activity, Stethoscope, ChevronDown, ChevronUp, BookOpen, Users, Heart, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { HeroVisual } from "@/components/three/HeroVisual";
import { TimelineSpine } from "@/components/three/TimelineSpine";



// Search params listener to trigger CV modal from external links/bots
function SearchParamsListener({ onOpenCV }: { onOpenCV: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("cv") === "true") {
      onOpenCV();
    }
  }, [searchParams]); // Exclude onOpenCV to avoid infinite triggers
  return null;
}

// Dynamically import heavy modal
const CVRequestModal = dynamic(() => import("@/components/CVRequestModal"), { ssr: false });

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Clinical" | "Research" | "Leadership" | "Education">("All");
  const [expandedNode, setExpandedNode] = useState<number | null>(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  
  // Typing text carousel state
  const domains = ["Critical Care", "Cardiovascular/Pulmonary", "AI in Health", "Clinical Research"];
  const [currentDomain, setCurrentDomain] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  const handleCloseCVModal = () => {
    setIsCVModalOpen(false);
    // Remove the ?cv=true param from the URL so it can be triggered again later
    if (window.location.search.includes("cv=true")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDomain((prev) => (prev + 1) % domains.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [domains.length]);

  const filteredPositions = portfolioData.positions.filter((pos) => {
    if (activeFilter === "All") return true;
    return pos.category === activeFilter;
  });

  return (
    <div className="pt-24 pb-16 relative">
      <Suspense fallback={null}>
        <SearchParamsListener onOpenCV={() => setIsCVModalOpen(true)} />
      </Suspense>



      {/* HERO SECTION */}
      <section ref={heroSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/10 backdrop-blur-md text-teal-750 dark:text-teal-300 text-sm font-medium border border-teal-500/20">
              <MapPin className="h-4 w-4" />
              {portfolioData.personalInfo.location}
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-lg">
              <span className="block">{portfolioData.personalInfo.name}</span>
            </h1>
            
            <div className="text-xl md:text-2xl text-slate-650 dark:text-slate-200 font-medium h-8 drop-shadow-md">
              Expertise in{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentDomain}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-teal-600 dark:text-teal-400 inline-block font-bold"
                >
                  {domains[currentDomain]}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-xl shadow-sm border border-white/20 dark:border-slate-800/40">
                <Award className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">ECFMG-certified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-xl shadow-sm border border-white/20 dark:border-slate-800/40">
                <Stethoscope className="h-5 w-5 text-teal-500" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Physician</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-xl shadow-sm border border-white/20 dark:border-slate-800/40">
                <Activity className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Clinical Researcher</span>
              </div>
            </div>

            <div className="pt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => setIsCVModalOpen(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-medium shadow-md shadow-teal-600/10 hover:shadow-teal-500/20 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Request Professional CV
              </button>
              <a 
                href="/research"
                className="px-8 py-3.5 backdrop-blur-md bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 text-slate-900 dark:text-slate-50 border border-white/25 dark:border-slate-800/60 rounded-xl font-medium shadow-sm transition-all"
              >
                Explore Research
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <HeroVisual sectionRef={heroSectionRef} />
          </motion.div>
        </div>
      </section>

      {/* EXECUTIVE OVERVIEW */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6 drop-shadow-lg">Executive Overview</h2>
            <p className="text-lg text-slate-600 dark:text-slate-200 leading-relaxed font-medium drop-shadow-md">
              {portfolioData.personalInfo.summary}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-350"
            >
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center mb-6">
                <Stethoscope className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Clinical Practice</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckIcon /> <span>Level 3 ICU management (Sepsis, ARDS, Shock)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon /> <span>Advanced invasive procedures (Intubation, CVC)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon /> <span>ACLS/BLS/ATLS Resuscitation leadership</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon /> <span>Point-of-Care Ultrasound (POCUS)</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-350"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Academic & Research</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckIcon color="text-blue-500" /> <span>Multicentric study coordination across 20 ICUs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon color="text-blue-500" /> <span>IRB/NHRC Proposal submissions & GCP compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon color="text-blue-500" /> <span>Data cleaning & IBM SPSS statistical analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon color="text-blue-500" /> <span>Manuscript drafting (ICMJE Format) & Peer-Review</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FILTERABLE TIMELINE */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4 drop-shadow-lg">Professional Trajectory</h2>
          
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {(["All", "Clinical", "Research", "Leadership", "Education"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setExpandedNode(null);
                  }}
                  aria-pressed={activeFilter === filter}
                  aria-label={`Filter by ${filter}`}
                  className={clsx(
                    "px-5 py-2.5 rounded-xl text-sm font-medium transition-all border cursor-pointer",
                    activeFilter === filter
                      ? "bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-500/20"
                      : "text-slate-200 bg-slate-900/60 hover:bg-slate-800 backdrop-blur-md border-slate-700/50"
                  )}
                >
                  {filter}
                </button>
            ))}
          </div>
        </div>

        <div ref={timelineRef} className="relative border-l-2 border-teal-500/25 dark:border-teal-500/15 ml-4 md:ml-8">
          <TimelineSpine containerRef={timelineRef} />
          <AnimatePresence>
            {filteredPositions.map((pos, index) => (
              <motion.div 
                key={`${pos.title}-${pos.organization}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="mb-8 pl-8 relative"
              >
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                  pos.category === "Clinical" ? "bg-teal-500" :
                  pos.category === "Research" ? "bg-blue-500" :
                  "bg-amber-500"
                }`} />
                
                <article 
                  className="glass-card rounded-2xl p-6 cursor-pointer hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 dark:border-slate-800"
                  onClick={() => setExpandedNode(expandedNode === index ? null : index)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setExpandedNode(expandedNode === index ? null : index) }}
                  tabIndex={0}
                  role="button"
                  aria-expanded={expandedNode === index}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-sm font-bold text-teal-600 dark:text-teal-400 mb-1">
                        {pos.startDate} - {pos.endDate}
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50">{pos.title}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">{pos.organization}</p>
                      {pos.location && <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> {pos.location}</p>}
                    </div>
                    <div className="mt-2 text-slate-400" aria-hidden="true">
                      {expandedNode === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedNode === index && pos.responsibilities.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-4 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                          {pos.responsibilities.map((resp, i) => (
                            <li key={i} className="text-slate-600 dark:text-slate-300 text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 shrink-0" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* CLINICAL TOOLKIT MATRIX */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 drop-shadow-lg">Clinical Toolkit Matrix</h2>
            <p className="text-slate-600 dark:text-slate-200 mt-4 font-medium drop-shadow-md">Core competencies and procedural skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData.skills.map((skillGroup, idx) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-8 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  {idx === 0 ? <Activity className="w-6 h-6 text-teal-500" /> : <Stethoscope className="w-6 h-6 text-teal-500" />}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{skillGroup.category}</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skillGroup.items.map((item, i) => {
                    const [title, desc] = item.split(":");
                    return (
                      <div key={i} className="flex flex-col p-4 rounded-xl bg-white/20 dark:bg-slate-900/20 border border-white/15 dark:border-slate-800/40">
                        <span className="font-semibold text-slate-900 dark:text-slate-50">{title}</span>
                        {desc && <span className="text-xs text-slate-605 dark:text-slate-400 mt-1">{desc.trim()}</span>}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HUMANITARIAN FOOTPRINT */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 drop-shadow-lg">Humanitarian Footprint</h2>
          <p className="text-slate-600 dark:text-slate-200 mt-4 font-medium drop-shadow-md">Dedicated to community health and equitable medical access</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioData.volunteering.map((vol, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col h-full hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-xs font-bold text-rose-500 dark:text-rose-400 mb-2">{vol.date}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">{vol.organization}</h3>
              <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4">
                <MapPin className="w-3 h-3" /> {vol.location}
              </div>
              <ul className="space-y-2 mt-auto text-sm text-slate-600 dark:text-slate-300">
                {vol.responsibilities.slice(0, 3).map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-450 mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <CVRequestModal isOpen={isCVModalOpen} onClose={handleCloseCVModal} />
    </div>
  );
}

function CheckIcon({ color = "text-teal-500" }: { color?: string }) {
  return (
    <svg className={`w-5 h-5 ${color} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
