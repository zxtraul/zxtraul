"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { GalleryTileTilt } from "@/components/three/GalleryTileTilt";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

// Mock media items with actual generated image paths
const mediaItems = [
  { 
    id: 1, 
    type: "landscape", 
    title: "National ICU Registry Meeting", 
    description: "Coordinating with 20 ICUs across Nepal to establish standardized critical care data pipelines.",
    image: "/media-icu-meeting.png" 
  },
  { 
    id: 2, 
    type: "portrait", 
    title: "Medical Congress Presentation", 
    description: "Presenting clinical research findings on Antimicrobial Resistance at a regional healthcare summit.",
    image: "/media-congress-presentation.png" 
  },
  { 
    id: 3, 
    type: "square", 
    title: "Cardiac Health Camp", 
    description: "Screening and providing essential cardiac consultations for over 450 patients in rural Sindhupalchowk.",
    image: "/media-cardiac-camp.png" 
  },
  { 
    id: 4, 
    type: "landscape", 
    title: "UPMC Western Maryland", 
    description: "Participating in critical clinical observership rounds, ICU case discussions, and U.S. hospital rotations.",
    image: "/media-observership.png" 
  },
  { 
    id: 5, 
    type: "portrait", 
    title: "POCUS Training Workshop", 
    description: "Demonstrating point-of-care bedside ultrasound techniques to clinical trainees and junior staff.",
    image: "/media-pocus-training.png" 
  },
  { 
    id: 6, 
    type: "square", 
    title: "HAMS ICU Team", 
    description: "Collaborating with HAMS Hospital's multidisciplinary critical care team during patient resuscitation procedures.",
    image: "/media-hams-icu.png" 
  },
];

export default function MediaPage() {
  const [selectedImage, setSelectedImage] = useState<typeof mediaItems[0] | null>(null);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-transparent">
      
      {/* VISUAL PORTFOLIO (MASONRY GALLERY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
            Media Gallery
          </h1>
          <p className="text-slate-650 dark:text-slate-350 max-w-2xl mx-auto">
            A visual documentation of clinical practice, academic presentations, and humanitarian outreach.
          </p>
        </div>

        {/* CSS-based Masonry Grid */}
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {mediaItems.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              className="break-inside-avoid"
            >
              <GalleryTileTilt
                onClick={() => setSelectedImage(item)}
                className={clsx(
                  "relative group cursor-pointer overflow-hidden rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-slate-950/35 border border-white/20 dark:border-white/10 shadow-md hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300",
                  item.type === "landscape" ? "aspect-video" :
                  item.type === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-200 text-sm mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </GalleryTileTilt>
            </motion.div>
          ))}
        </motion.div>
      </section>
 
      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-slate-900 dark:text-slate-100 hover:text-teal-650 dark:hover:text-teal-400 transition-colors bg-white/30 dark:bg-slate-800/40 border border-white/25 dark:border-slate-700/40 rounded-full p-2.5 cursor-pointer z-50 shadow-md"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="max-w-5xl w-full flex flex-col md:flex-row bg-white/45 dark:bg-slate-900/35 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/25 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 bg-slate-950 relative min-h-[300px] md:min-h-[500px] flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-250 dark:border-slate-800">
                 <div className="relative w-full h-[70vh]">
                   <Image 
                     src={selectedImage.image}
                     alt={selectedImage.title}
                     fill
                     className="object-contain"
                   />
                 </div>
              </div>
              <div className="w-full md:w-80 p-8 flex flex-col justify-center bg-white/70 dark:bg-slate-950/60 backdrop-blur-md">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  {selectedImage.title}
                </h3>
                <p className="text-slate-650 dark:text-slate-300 leading-relaxed text-sm">
                  {selectedImage.description}
                </p>
                <div className="mt-8 pt-8 border-t border-slate-250 dark:border-slate-800">
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                    Visual Portfolio
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    Dr. Rahul Parajuli
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
