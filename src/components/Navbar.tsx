"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Activity } from "lucide-react";
import clsx from "clsx";
import CVRequestModal from "./CVRequestModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Profile", path: "/" },
    { name: "Research & Publications", path: "/research" },
    { name: "Blog", path: "/blog" },
    { name: "Gallery", path: "/media" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 w-full z-40 transition-all duration-300",
          isScrolled ? "glass shadow-sm py-3" : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Activity className="h-8 w-8 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-50">
                Dr. Rahul Parajuli
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <ul className="flex space-x-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className={clsx(
                        "text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400 relative py-2",
                        pathname === link.path
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-slate-600 dark:text-slate-300"
                      )}
                    >
                      {link.name}
                      {pathname === link.path && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              {pathname !== "/" && (
                <button
                  onClick={() => setIsCVModalOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Request CV
                </button>
              )}
              

            </div>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass absolute top-full left-0 w-full border-t border-slate-200 dark:border-slate-800">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "block px-3 py-3 rounded-md text-base font-medium",
                    pathname === link.path
                      ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-3 space-y-3">

                {pathname !== "/" && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsCVModalOpen(true);
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-md text-base font-medium transition-colors"
                  >
                    Request Professional CV
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <CVRequestModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
      />
    </>
  );
}
