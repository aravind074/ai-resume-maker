"use client";

import { useAuthStore } from "@/store/authStore";
import { FileText, Target, Mic, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return <div>Loading...</div>;

  const features = [
    {
      title: "AI Resume Builder",
      description: "Create stunning, ATS-friendly resumes with AI assistance.",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      href: "/builder",
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "ATS Analyzer",
      description: "Score your resume against job descriptions to optimize keywords.",
      icon: <Target className="w-8 h-8 text-green-500" />,
      href: "/ats",
      color: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "AI Interview Coach",
      description: "Practice interviews with dynamic GPT-4o powered questions.",
      icon: <Mic className="w-8 h-8 text-purple-500" />,
      href: "/interview",
      color: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "My Profile",
      description: "Update your core details used for instant resume generation.",
      icon: <UserIcon className="w-8 h-8 text-orange-500" />,
      href: "/profile",
      color: "bg-orange-50 dark:bg-orange-900/20",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.full_name?.split(' ')[0] || "User"}!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">What would you like to achieve today?</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feat, idx) => (
            <Link key={idx} href={feat.href}>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4">
                <div className={`p-4 rounded-xl ${feat.color}`}>
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
