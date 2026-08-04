"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

export default function InterviewPage() {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const startInterview = async () => {
    if (!jobRole.trim()) return alert("Job role is required");
    setLoading(true);
    try {
      const res = await api.post("/interviews/start", { job_role: jobRole, job_description: jobDescription });
      setSession(res.data);
    } catch (err) {
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (questionId: number) => {
    if (!answer.trim()) return alert("Please provide an answer");
    setLoading(true);
    try {
      await api.post(`/interviews/questions/${questionId}/answer`, { answer_text: answer });
      // Refresh session to get next question / feedback
      const res = await api.get(`/interviews/${session.id}`);
      setSession(res.data);
      setAnswer("");
    } catch (err) {
      alert("Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">AI Interview Coach</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Role</label>
              <input 
                value={jobRole} onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="mt-1 block w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Description (Optional)</label>
              <textarea 
                value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste JD for more tailored questions..."
                className="mt-1 block w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                rows={4}
              />
            </div>
            <Button onClick={startInterview} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {loading ? "Preparing Questions..." : "Start Interview"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions.find((q: any) => !q.is_answered);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Interview for {session.job_role}</h1>
          {session.is_completed && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">Completed</span>}
        </div>

        {session.is_completed ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow text-center border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-4">Interview Complete!</h2>
            <div className="text-6xl font-black text-indigo-600 mb-6">{session.overall_score}%</div>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Review your feedback below.</p>
            <Button onClick={() => setSession(null)} variant="outline">Start New Interview</Button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow mb-8 border border-gray-100 dark:border-gray-700">
            <div className="text-sm font-medium text-indigo-600 mb-2">Question {currentQuestion.question_order} of {session.questions.length}</div>
            <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-6">{currentQuestion.question_text}</h2>
            
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-40 px-4 py-3 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
            />
            <div className="flex justify-end">
              <Button onClick={() => submitAnswer(currentQuestion.id)} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                {loading ? "Evaluating..." : "Submit Answer"}
              </Button>
            </div>
          </div>
        )}

        {/* History */}
        <div className="space-y-6">
          {session.questions.filter((q: any) => q.is_answered).map((q: any) => (
            <div key={q.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Q: {q.question_text}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Your Answer: {q.answer.answer_text}</p>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-200">AI Feedback</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Score: {q.answer.score}/100</span>
                </div>
                <p className="text-sm text-indigo-800 dark:text-indigo-300">{q.answer.feedback}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
