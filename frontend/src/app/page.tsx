"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Target, Mic, ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            ResumeMaker AI
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold text-gray-700 dark:text-gray-300">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6 font-semibold">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold text-sm border border-indigo-100 dark:border-indigo-800">
              🎉 The ultimate AI-powered career platform is here
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Land your dream job with <br className="hidden md:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Superhuman Precision.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Build ATS-optimized resumes in seconds, score your fit against any job description, and practice with our dynamic GPT-4o Interview Coach.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-8 h-14 text-lg font-semibold gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
                  Start Building Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-semibold bg-white dark:bg-gray-800">
                  Login
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Value Props */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FileText className="w-8 h-8 text-blue-500" />,
                title: "AI Resume Builder",
                desc: "Drag-and-drop builder with live PDF rendering. GPT-4o automatically enhances your bullet points.",
                color: "bg-blue-50 dark:bg-blue-900/20"
              },
              {
                icon: <Target className="w-8 h-8 text-green-500" />,
                title: "ATS Analyzer",
                desc: "Paste any Job Description. Our algorithm scores your resume and tells you exactly what keywords to add.",
                color: "bg-green-50 dark:bg-green-900/20"
              },
              {
                icon: <Mic className="w-8 h-8 text-purple-500" />,
                title: "AI Interview Coach",
                desc: "Practice answering dynamic, role-specific questions and receive instant constructive feedback.",
                color: "bg-purple-50 dark:bg-purple-900/20"
              }
            ].map((feat, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 text-left relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-16 h-16 rounded-2xl ${feat.color} flex items-center justify-center mb-6`}>
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feat.desc}
                </p>
                <div className="absolute top-4 right-4 text-gray-200 dark:text-gray-700 opacity-50 group-hover:opacity-100 transition-opacity">
                  <CheckCircle className="w-24 h-24 absolute -top-8 -right-8" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
