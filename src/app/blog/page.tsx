"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Activity, Send } from "lucide-react";
import { portfolioData } from "@/data/portfolioData";
import clsx from "clsx";

// Mock JSON array mimicking a real-time feed or structure for API shell
const mockLinkedInPosts = [
  {
    id: "post1",
    author: {
      name: portfolioData.personalInfo.name,
      title: portfolioData.personalInfo.title,
      avatar: "RP",
    },
    timestamp: "2d",
    content: `Excited to share our latest findings published in Pulmonary Medicine (Wiley). We explored the diagnostic yield of malignant pleural effusion across various cancer subtypes. A huge thanks to the team for their relentless dedication! 🔬📄 #ClinicalResearch #Pulmonology #MedTech`,
    image: null,
    likes: 1245,
    reposts: 12,
    impressions: 15400,
    comments: [
      {
        id: "c1",
        author: { name: "Dr. Anjali Sharma", title: "Pulmonologist at MedCity", avatar: "AS" },
        text: "Incredible work, Dr. Parajuli! The stratification across subtypes is particularly insightful.",
        timestamp: "1d"
      },
      {
        id: "c2",
        author: { name: "Dr. James Wilson", title: "Clinical Researcher | Oncology", avatar: "JW" },
        text: "Congratulations to the team. Will this methodology be scaled for multicentric validation?",
        timestamp: "20h"
      }
    ],
  },
  {
    id: "post2",
    author: {
      name: portfolioData.personalInfo.name,
      title: portfolioData.personalInfo.title,
      avatar: "RP",
    },
    timestamp: "1w",
    content: `Just wrapped up an incredible session at the Eastern Critical Care Conclave 2.0. The discussions around AI in health and critical care outcomes were truly eye-opening. Looking forward to implementing these insights at NICRF. 🚀 #CriticalCare #HealthcareInnovation`,
    image: null,
    likes: 890,
    reposts: 5,
    impressions: 8200,
    comments: [
      {
        id: "c3",
        author: { name: "Dr. Sabin Koirala", title: "Medical Director, Consultant Intensivist", avatar: "SK" },
        text: "Great representation of our initiatives. Keep up the excellent work!",
        timestamp: "6d"
      }
    ],
  },
  {
    id: "post3",
    author: {
      name: portfolioData.personalInfo.name,
      title: portfolioData.personalInfo.title,
      avatar: "RP",
    },
    timestamp: "3w",
    content: `Our preprint on "Medication errors in Intensive Care Unit" is now live on medRxiv! We assessed the knowledge among critical care nurses and implemented a simple strategy to reduce errors. A crucial step towards patient safety. Read it here: https://doi.org/10.1101/2025.07.07.25331001 #PatientSafety #ICU #QualityImprovement`,
    image: null,
    likes: 2150,
    reposts: 45,
    impressions: 24500,
    comments: [
      {
        id: "c4",
        author: { name: "Sarah Jenkins, RN", title: "ICU Charge Nurse", avatar: "SJ" },
        text: "This is exactly the kind of practical intervention we need on the floor. Thank you for addressing this!",
        timestamp: "2w"
      },
      {
        id: "c5",
        author: { name: "Dr. Diptesh Aryal", title: "Executive Director, NICRF", avatar: "DA" },
        text: "A highly relevant study for our national registry. Proud of the team's output.",
        timestamp: "2w"
      },
      {
        id: "c6",
        author: { name: "Mark Davidson", title: "Healthcare Quality Analyst", avatar: "MD" },
        text: "Fascinating read. Have you considered evaluating the long-term sustainability of the intervention?",
        timestamp: "1w"
      }
    ],
  }
];

// Helper to format large numbers e.g. 1,245
const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

function BlogContent() {
  const searchParams = useSearchParams();
  const targetPostId = searchParams.get("post");

  useEffect(() => {
    if (targetPostId) {
      setTimeout(() => {
        const el = document.getElementById(targetPostId);
        if (el) {
          el.style.transition = "box-shadow 0.5s ease-in-out";
          el.style.boxShadow = "0 0 0 4px rgba(13, 148, 136, 0.5)"; // teal-650 ring
          setTimeout(() => { el.style.boxShadow = "none"; }, 3000);
          
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500); // Wait for animations to settle
    }
  }, [targetPostId]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header section explaining the API Shell */}
        <div className="mb-8 p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-950/30 rounded-2xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Blog & Updates</h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This module is structured as a live LinkedIn API integration shell. When connected to the LinkedIn Developer API, it will autonomously fetch and render real-time posts, articles, and professional updates. The metrics below have been formatted to mirror high-fidelity engagement data.
          </p>
        </div>

        {/* Feed Container */}
        <div className="space-y-6">
          {mockLinkedInPosts.map((post, idx) => (
            <PostCard key={post.id} post={post} delay={idx * 0.1} autoExpand={targetPostId === post.id} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 bg-transparent" />}>
      <BlogContent />
    </Suspense>
  );
}

function PostCard({ post, delay, autoExpand = false }: { post: typeof mockLinkedInPosts[0], delay: number, autoExpand?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(autoExpand);

  const formatContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+|https?:\/\/[^\s]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("#")) {
        return <span key={i} className="text-teal-600 dark:text-teal-400 font-medium cursor-pointer hover:underline">{part}</span>;
      }
      if (part.startsWith("http")) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 break-all">
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const truncatedContent = post.content.length > 150 ? post.content.substring(0, 150) + "... " : post.content;

  return (
    <motion.div
      id={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="backdrop-blur-xl bg-white/20 dark:bg-slate-950/35 rounded-2xl border border-white/20 dark:border-white/10 overflow-hidden shadow-lg hover:shadow-xl transition-all"
    >
      {/* Post Header */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg shrink-0 overflow-hidden border border-slate-300/30 dark:border-slate-600/30">
            {post.author.name === portfolioData.personalInfo.name ? (
              <img src="/profile.jpg" alt={post.author.name} className="w-full h-full object-cover" />
            ) : (
              post.author.avatar
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-base leading-tight hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors">
              {post.author.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{post.author.title}</p>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <span>{post.timestamp}</span>
              <span>•</span>
              <Activity className="w-3 h-3" />
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:bg-white/10 dark:hover:bg-white/5 p-2 rounded-full transition-colors cursor-pointer" aria-label="More options">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Body */}
      <div className="px-4 pb-3">
        <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {isExpanded ? formatContent(post.content) : formatContent(truncatedContent)}
          {post.content.length > 150 && !isExpanded && (
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-teal-650 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium ml-1 cursor-pointer"
            >
              ...see more
            </button>
          )}
        </p>
      </div>

      {/* High-Fidelity Engagement Counts */}
      <div className="px-4 py-2 flex justify-between items-center bg-white/5 dark:bg-slate-950/10 border-t border-white/10">
        <div className="flex items-center gap-1.5 group cursor-pointer">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border border-white dark:border-slate-850 z-20">
              <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
            </div>
            <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center border border-white dark:border-slate-850 z-10">
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center border border-white dark:border-slate-850 z-0">
              <svg viewBox="0 0 24 24" className="w-2 h-2 fill-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-teal-600 group-hover:underline">
            {formatNumber(isLiked ? post.likes + 1 : post.likes)}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <button 
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="hover:text-teal-600 hover:underline cursor-pointer"
          >
            {formatNumber(post.comments.length)} comments
          </button>
          <span>•</span>
          <span className="hover:text-teal-600 hover:underline cursor-pointer">
            {formatNumber(post.reposts)} reposts
          </span>
        </div>
      </div>

      {/* Analytics Banner */}
      <div className="px-4 py-2 bg-white/5 dark:bg-slate-950/20 border-t border-white/10 flex items-center gap-2">
        <Activity className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          <strong className="text-slate-800 dark:text-slate-200">{formatNumber(post.impressions)}</strong> impressions
        </span>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 border-t border-white/10 flex justify-between">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          aria-label="Like post"
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-sm font-medium cursor-pointer",
            isLiked 
              ? "text-teal-600 dark:text-teal-400 bg-teal-500/10" 
              : "text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5"
          )}
        >
          <ThumbsUp className={clsx("w-5 h-5", isLiked && "fill-current")} />
          Like
        </button>
        <button 
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          aria-label="Comment on post"
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-sm font-medium cursor-pointer",
            isCommentsOpen
              ? "text-slate-900 dark:text-slate-100 bg-white/10 dark:bg-white/5"
              : "text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5"
          )}
        >
          <MessageSquare className="w-5 h-5" />
          Comment
        </button>
        <button aria-label="Share post" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5 transition-all text-sm font-medium cursor-pointer">
          <Share2 className="w-5 h-5" />
          Repost
        </button>
        <button aria-label="Send post" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5 transition-all text-sm font-medium cursor-pointer">
          <Send className="w-5 h-5" />
          Send
        </button>
      </div>

      {/* Expandable Comments Section */}
      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-white/5 dark:bg-slate-950/15"
          >
            <div className="p-4 space-y-4">
              {/* Add Comment Input (Mock) */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-slate-300/30 dark:border-slate-600/30">
                  <img src="/profile.jpg" alt="RP" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    aria-label="Add a comment input"
                    className="w-full bg-white/20 dark:bg-slate-800/40 border border-slate-300/30 dark:border-slate-700/40 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:text-slate-100 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4 mt-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs shrink-0 mt-1 border border-slate-300/20 dark:border-slate-600/20">
                      {comment.author.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="bg-white/30 dark:bg-slate-900/30 rounded-xl rounded-tl-none p-3 shadow-sm border border-white/25 dark:border-slate-800/50 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer">
                              {comment.author.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                              {comment.author.title}
                            </p>
                          </div>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 ml-2">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">
                          {comment.text}
                        </p>
                      </div>
                      <div className="flex gap-3 mt-1 ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <button className="hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/10 dark:hover:bg-white/5 px-1.5 py-0.5 rounded transition-all cursor-pointer" aria-label="Like comment">Like</button>
                        <button className="hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/10 dark:hover:bg-white/5 px-1.5 py-0.5 rounded transition-all cursor-pointer" aria-label="Reply to comment">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
