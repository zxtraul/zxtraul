"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bot, X, Send, User, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { portfolioData } from "@/data/portfolioData";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Welcome to my portfolio! I'm Dr. Rahul Parajuli. How can I assist you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Process intent
    setTimeout(() => {
      processIntent(userMessage.text.toLowerCase());
    }, 600); // Small delay to simulate "thinking"
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const processIntent = (input: string) => {
    let reply = "";
    let destination = null;
    const lowerInput = input.toLowerCase();

    // 1. Contact / Reach out
    if (lowerInput.match(/(contact|email|phone|reach|message|connect)/)) {
      reply = `You can reach me at ${portfolioData.personalInfo.email} or call ${portfolioData.personalInfo.phone}. Or just leave a message below!`;
      destination = "/#contact";
    }
    // 2. Resume / CV
    else if (lowerInput.match(/(cv|resume|curriculum vitae)/)) {
      reply = "I'd be glad to share my CV. Opening the request form for you now!";
      destination = "/?cv=true";
    }
    // 3. Education
    else if (lowerInput.match(/(education|degree|school|college|university|study)/)) {
      reply = `I earned my Primary Medical Degree (MBBS) from ${portfolioData.education[0].institution} between ${portfolioData.education[0].date}.`;
    }
    // 4. Skills / Toolkit
    else if (lowerInput.match(/(skill|toolkit|tool|technology|proficien)/)) {
      reply = `My key clinical skills include ${portfolioData.skills[1].items[0].split(':')[0]}, ${portfolioData.skills[1].items[1].split(':')[0]}. I am also proficient in research tools like ${portfolioData.skills[0].items[0].split(':')[1].trim()}.`;
    }
    // 5. Experience / Jobs
    else if (lowerInput.match(/(experience|job|work|employment|career|hospital)/)) {
      reply = `I am currently a ${portfolioData.positions[0].title} at ${portfolioData.positions[0].organization}. Previously, I worked as a Medical Officer in the ICU at HAMS Hospital.`;
    }
    // 6. Publications / Research
    else if (lowerInput.match(/(research|publication|paper|journal|article)/)) {
      reply = `I have several publications, such as "${portfolioData.publications[0].title}". You can view all my research in the Research section.`;
      destination = "/research";
    }
    // 7. Volunteering
    else if (lowerInput.match(/(volunteer|camp|community|charity)/)) {
      reply = `I frequently volunteer for health camps. Recently, I volunteered at ${portfolioData.volunteering[0].organization} in ${portfolioData.volunteering[0].location}.`;
    }
    // 8. Blog / Articles
    else if (lowerInput.match(/(blog|post|update|news|medication error)/)) {
      reply = "You can view my recent updates and thoughts on the blog. Navigating there now...";
      destination = "/blog";
    }
    // 9. About / Summary
    else if (lowerInput.match(/(about|who are you|summary|profile|background)/)) {
      reply = portfolioData.personalInfo.summary;
    }
    // 10. Fallback
    else {
      reply = "I'm here to help you navigate! Just ask me about my skills, experience, education, research, or contact info.";
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      sender: "bot",
      text: reply,
    };

    setMessages((prev) => [...prev, botMessage]);

    if (destination) {
      setTimeout(() => {
        router.push(destination);
      }, 1500); // Navigate after a delay to allow reading
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-teal-700 transition-colors border-2 border-white dark:border-slate-800"
            aria-label="Open AI Assistant"
          >
            <Bot className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-4 right-4 sm:left-auto sm:bottom-8 sm:right-8 z-50 w-auto sm:w-[380px] h-[500px] max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                <Bot className="w-5 h-5" />
                <span className="font-semibold text-sm">Dr. Rahul Parajuli</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Close Assistant"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={clsx(
                    "flex gap-2 max-w-[85%]",
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm",
                      msg.sender === "user" ? "bg-slate-800 dark:bg-slate-700" : "bg-teal-600"
                    )}
                  >
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={clsx(
                      "px-4 py-2 rounded-2xl text-sm leading-relaxed",
                      msg.sender === "user"
                        ? "bg-slate-800 dark:bg-slate-700 text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Dr. Parajuli..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-transparent focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 rounded-full text-sm text-slate-900 dark:text-slate-50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-colors"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
