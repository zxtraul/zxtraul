import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";
import { Mail, MapPin, Activity } from "lucide-react";
import ContactForm from "./ContactForm";
import { SignatureMark } from "./SignatureMark";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Brand & Links */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-teal-500" />
                <span className="font-bold text-lg text-slate-900 dark:text-slate-50 tracking-tight">
                  Dr. Rahul Parajuli
                </span>
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
                {portfolioData.personalInfo.title}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 text-teal-500" />
                {portfolioData.personalInfo.location}
              </div>
            </div>

            {/* Quick Links & Socials Combined */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4 tracking-wide">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="transition-colors text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400">Profile</Link>
                  </li>
                  <li>
                    <Link href="/research" className="transition-colors text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400">Research</Link>
                  </li>
                  <li>
                    <Link href="/blog" className="transition-colors text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400">Blog</Link>
                  </li>
                  <li>
                    <Link href="/media" className="transition-colors text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400">Gallery</Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4 tracking-wide">Connect</h3>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <a
                    href={`mailto:${portfolioData.personalInfo.email}`}
                    className="flex items-center gap-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                    title="Email"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">Email Me</span>
                  </a>
                  <a
                    href={portfolioData.personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href={`https://orcid.org/${portfolioData.personalInfo.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0">
                      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/>
                    </svg>
                    ORCID
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 lg:-top-24">
            <ContactForm />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-300 dark:border-slate-800 text-center text-sm text-slate-500">
          <SignatureMark />
          <p className="mt-3">© {new Date().getFullYear()} Dr. Rahul Parajuli. All rights reserved.</p>
          <p className="mt-1">Designed with a Clinical-Tech aesthetic.</p>
        </div>
      </div>
    </footer>
  );
}
