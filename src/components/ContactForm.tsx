"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Send, ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

export default function ContactForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-8"
          >
            <div className="mx-auto w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">Message Sent</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Thank you for reaching out. I'll get back to you as soon as possible.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-8 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg text-sm font-medium transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="mb-6 border-b border-slate-200 dark:border-slate-700 pb-4 flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <Send className="w-5 h-5 text-teal-500" />
                  Leave a Message
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Reach out for collaborations, consults, or general inquiries.
                </p>
              </div>
              <button 
                type="button"
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                aria-label={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                  onSubmit={handleSubmit}
                >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all text-slate-900 dark:text-slate-50 placeholder-slate-400"
                  placeholder="Dr. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all text-slate-900 dark:text-slate-50 placeholder-slate-400"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none text-slate-900 dark:text-slate-50 placeholder-slate-400"
                  placeholder="How can I help you?"
                />
              </div>

              {errorMsg && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={clsx(
                  "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium transition-all mt-6",
                  isSubmitting
                    ? "bg-teal-600/70 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Secure Message"
                )}
              </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
