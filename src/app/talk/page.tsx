"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, User, Stethoscope, Video, Phone, Mail } from "lucide-react";
import clsx from "clsx";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function TelehealthPortal() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello, I am Dr. Rahul Parajuli. Welcome to my telehealth portal. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSendingSummary, setIsSendingSummary] = useState(false);
  const [summarySent, setSummarySent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting to my systems right now. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const endConsultation = async () => {
    setIsSendingSummary(true);
    try {
      await fetch("/api/chat/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, patientEmail }),
      });
      setSummarySent(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send summary email.");
    } finally {
      setIsSendingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col pt-24 pb-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col backdrop-blur-xl bg-white/20 dark:bg-slate-950/35 rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-teal-500/10 backdrop-blur-md text-slate-800 dark:text-slate-100 p-4 sm:p-6 flex items-center justify-between border-b border-white/10 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/10 p-2.5 rounded-full border border-teal-500/20">
              <Stethoscope className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl leading-tight">Telehealth Portal</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Dr. Rahul Parajuli is Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 bg-slate-200/50 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 transition-all px-3.5 py-1.5 rounded-xl text-sm font-medium border border-slate-300/30 dark:border-white/10">
              <Video className="w-4 h-4" /> Video
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-slate-200/50 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 transition-all px-3.5 py-1.5 rounded-xl text-sm font-medium border border-slate-300/30 dark:border-white/10">
              <Phone className="w-4 h-4" /> Call
            </button>
            <button 
              onClick={() => setShowSummaryModal(true)}
              className="bg-red-500/90 hover:bg-red-500 text-white transition-colors px-4 py-1.5 rounded-xl text-sm font-bold shadow-sm"
            >
              End Consult
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white/5 dark:bg-slate-950/10 scrollbar-thin">
          <div className="text-center my-2">
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-200/40 dark:bg-slate-800/40 border border-slate-300/20 dark:border-slate-700/30 rounded-full py-1 px-4 inline-block">
              This is a secure AI simulation. Not for medical emergencies.
            </div>
          </div>
          
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={clsx(
                "flex gap-3 max-w-[90%] sm:max-w-[80%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md border",
                  msg.role === "user" 
                    ? "bg-slate-800 dark:bg-slate-700 border-slate-700 text-white" 
                    : "bg-gradient-to-br from-teal-500 to-emerald-500 border-teal-400/20 text-white"
                )}
              >
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
              </div>
              <div
                className={clsx(
                  "px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-500 dark:to-emerald-500 text-white rounded-tr-none shadow-teal-500/10"
                    : "bg-white/45 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 border border-white/20 dark:border-slate-800/60 rounded-tl-none backdrop-blur-sm"
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md border border-teal-400/20">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white/45 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/60 rounded-tl-none backdrop-blur-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/10 dark:bg-slate-950/20 backdrop-blur-md border-t border-white/10 z-10">
          <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms or ask a question..."
              className="w-full pl-4 pr-4 py-3 min-h-[52px] max-h-[120px] bg-white/20 dark:bg-slate-850/40 border border-slate-300/30 dark:border-slate-700/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-xl text-slate-900 dark:text-slate-50 transition-all resize-none scrollbar-none outline-none"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-500 dark:to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/10 disabled:opacity-50 transition-all shadow-md shrink-0 cursor-pointer"
              aria-label="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20 dark:border-slate-850"
          >
            {summarySent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">Summary Sent!</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
                  The consultation summary has been securely emailed to Dr. Parajuli. He will respond to your email shortly.
                </p>
                <button 
                  onClick={() => { setShowSummaryModal(false); setSummarySent(false); setMessages([]); }}
                  className="w-full py-2.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
                >
                  Close & Restart
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">End Consultation</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                  Please enter your email address to receive follow-up communication. The AI will generate a clinical summary of this chat and send it to the doctor.
                </p>
                <input 
                  type="email" 
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none mb-6"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowSummaryModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors border border-slate-250 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={endConsultation}
                    disabled={isSendingSummary}
                    className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-500 dark:to-emerald-500 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-lg disabled:opacity-70"
                  >
                    {isSendingSummary ? "Sending..." : "Confirm & End"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
