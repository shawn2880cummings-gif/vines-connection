"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function UniversityPage() {
  const courses = [
    {
      title: "Melanin Intelligence",
      description: "A comprehensive 18-module journey into neuromelanin biology, the electromagnetic architecture of existence, and the biological substrate of recursive awareness.",
      link: "https://melanin-intelligence-course.vercel.app",
      image: "/vines-logo.jpg", // Using the logo as a placeholder/brand image
      badge: "New Release",
      color: "from-psyche-gold to-psyche-teal"
    },
    {
      title: "Collapse Recursion",
      description: "Master the logic of coherence. A deep dive into the foundational principles of recursion, vortex math, and the dismantling of institutional distortions.",
      link: "https://melanin-intelligence-course.vercel.app/course/collapse-recursion", // Assuming it's a route in the same platform
      image: "https://assets.lulu.com/cover_thumbs/g/j/gjpe5ee-front-shortedge-384.jpg",
      badge: "Foundational",
      color: "from-psyche-violet to-psyche-magenta"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-24 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="orb left-[10%] top-[20%] h-64 w-64 bg-psyche-teal/10" />
        <div className="orb right-[15%] bottom-[30%] h-80 w-80 bg-psyche-magenta/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div 
          {...fadeInUp}
          className="text-center mb-20"
        >
          <span className="text-sm tracking-widest text-psyche-gold uppercase mb-4 block">
            The Learning Platform
          </span>
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Etheric <span className="gradient-text">University</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Choose your path of discovery. Our courses bridge biological reality, 
            mathematical coherence, and spiritual sovereignty.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {courses.map((course, idx) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + idx * 0.2 }}
              whileHover={{ y: -10 }}
              className="gradient-card rounded-3xl p-1 overflow-hidden group shadow-2xl"
            >
              <div className="bg-celestial-900/80 rounded-[22px] p-8 md:p-10 h-full flex flex-col">
                <div className="relative h-64 w-full mb-8 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full text-xs font-semibold text-psyche-gold uppercase tracking-widest">
                      {course.badge}
                    </span>
                  </div>
                </div>

                <h2 
                  className="text-3xl font-bold mb-4 group-hover:text-psyche-gold transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {course.title}
                </h2>
                <p className="text-text-secondary text-lg mb-10 flex-1 leading-relaxed">
                  {course.description}
                </p>

                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`glow-gold inline-flex justify-center rounded-full bg-gradient-to-r ${course.color} px-10 py-4 text-lg font-semibold text-celestial-900 transition-all hover:scale-105 active:scale-95 text-center shadow-xl`}
                >
                  Enter Course
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 text-center"
        >
          <Link 
            href="/"
            className="text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
