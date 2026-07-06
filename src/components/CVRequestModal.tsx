"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, FileText } from "lucide-react";
import emailjs from "@emailjs/browser";
import clsx from "clsx";

interface CVRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVRequestModal({ isOpen, onClose }: CVRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const organization = formData.get("organization") as string;
    const purpose = formData.get("purpose") as string;
    const userEmail = formData.get("email") as string;

    try {
      const response = await fetch("/api/request-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          organization,
          purpose,
          email: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send request.");
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 4000);
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg pointer-events-auto"
            >
              <div className="glass-card rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="p-8">
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-4"
                    >
                      <div className="mx-auto w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        Request Logged
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        A verified copy of the CV will be dispatched via email upon physician authorization.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-700 pb-6">
                        <div className="p-2.5 bg-teal-50 dark:bg-teal-900/30 rounded-xl">
                          <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                            Request Professional CV
                          </h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Please provide your details for access to the complete professional portfolio.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Full Name
                          </label>
                          <input
                            required
                            type="text"
                            name="fullName"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            placeholder="Dr. Jane Doe"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Organization/Title
                            </label>
                            <input
                              required
                              type="text"
                              name="organization"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                              placeholder="Institution Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Professional Email
                            </label>
                            <input
                              required
                              type="email"
                              name="email"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                              placeholder="jane@hospital.org"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Purpose of Request
                          </label>
                          <select
                            required
                            name="purpose"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all text-slate-900 dark:text-slate-100"
                          >
                            <option value="" disabled selected>
                              Select a purpose...
                            </option>
                            <option value="Residency/Match Query">Residency/Match Query</option>
                            <option value="Research Collaboration">Research Collaboration</option>
                            <option value="Hospital Recruitment">Hospital Recruitment</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {errorMsg && (
                          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                            {errorMsg}
                          </div>
                        )}

                        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-700">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={clsx(
                              "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-all",
                              isSubmitting
                                ? "bg-teal-600/70 cursor-not-allowed"
                                : "bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            )}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing Request...
                              </>
                            ) : (
                              "Submit Secure Request"
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
