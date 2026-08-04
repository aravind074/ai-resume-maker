"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { Users, FileText, Mic, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading admin dashboard...</div>;
  if (!stats) return <div className="p-8 text-red-500">Access Denied or Failed to load.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Platform Overview & Metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24}/></div>
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Total Users</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.metrics.total_users}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg"><FileText size={24}/></div>
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Resumes Built</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.metrics.total_resumes}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Mic size={24}/></div>
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Interviews Taken</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.metrics.total_interviews}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Activity size={24}/></div>
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Platform Health</h3>
            </div>
            <p className="text-xl font-bold text-green-500">All Systems Go</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="pb-3 text-gray-500 font-medium">ID</th>
                  <th className="pb-3 text-gray-500 font-medium">Name</th>
                  <th className="pb-3 text-gray-500 font-medium">Email</th>
                  <th className="pb-3 text-gray-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_users.map((u: any) => (
                  <tr key={u.id} className="border-b dark:border-gray-700 last:border-0">
                    <td className="py-4 text-gray-800 dark:text-gray-300">#{u.id}</td>
                    <td className="py-4 text-gray-800 dark:text-gray-300 font-medium">{u.full_name}</td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="py-4 text-gray-500 dark:text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
