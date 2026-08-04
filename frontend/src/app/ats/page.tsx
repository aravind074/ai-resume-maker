"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useResumeStore } from "@/store/resumeStore";
import { useRouter } from "next/navigation";

export default function ATSAnalyzerPage() {
  const store = useResumeStore();
  const { data } = store;
  const router = useRouter();
  
  const [jobDescription, setJobDescription] = useState("");
  const [source, setSource] = useState<"builder" | "upload">("builder");
  const [file, setFile] = useState<File | null>(null);
  
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [tailorSuccess, setTailorSuccess] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    if (source === "upload" && !file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    setLoadingAnalyze(true);
    setError("");
    setResult(null);
    setTailorSuccess(false);

    try {
      let response;
      if (source === "builder") {
        const resumeText = `
          Name: ${data.personalInfo?.fullName}
          Summary: ${data.summary}
          Experience: ${data.experience?.map(e => e.company + ' - ' + e.position + ': ' + e.description).join(' ')}
          Education: ${data.education?.map(e => e.institution + ' - ' + e.degree).join(' ')}
          Skills: ${data.skills?.map(s => s.name).join(', ')}
          Projects: ${data.projects?.map(p => p.name + ': ' + p.description).join(' ')}
        `;

        response = await api.post("/ats/analyze", {
          resume_text: resumeText,
          job_description: jobDescription
        });
      } else {
        const formData = new FormData();
        formData.append("file", file!);
        formData.append("job_description", jobDescription);
        
        response = await api.post("/ats/analyze-file", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }
      
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Analysis failed");
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description to tailor against.");
      return;
    }

    if (source === "upload") {
      setError("Auto-tailoring currently only supports the Builder Resume. Please switch to 'Builder' source.");
      return;
    }

    setLoadingTailor(true);
    setError("");
    setTailorSuccess(false);

    try {
      const response = await api.post("/ats/tailor", {
        resume_data: data,
        job_description: jobDescription
      });
      
      store.setFullResumeData(response.data);
      setTailorSuccess(true);
      setResult(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to tailor resume");
    } finally {
      setLoadingTailor(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">ATS Analyzer & Tailoring</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            
            {/* Source Toggle */}
            <div className="mb-6 flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${source === 'builder' ? 'bg-white shadow text-gray-900 dark:bg-gray-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}
                onClick={() => setSource("builder")}
              >
                Builder Resume
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${source === 'upload' ? 'bg-white shadow text-gray-900 dark:bg-gray-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}
                onClick={() => setSource("upload")}
              >
                Upload PDF
              </button>
            </div>

            {source === "upload" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Resume (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-gray-700 dark:file:text-white"
                />
              </div>
            )}

            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Target Job Description</h2>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 px-4 py-3 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4 focus:ring-2 focus:ring-indigo-500"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleAnalyze} 
                disabled={loadingAnalyze || loadingTailor}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
              >
                {loadingAnalyze ? "Analyzing..." : "1. Run Analysis (Check Score)"}
              </Button>
              
              <Button 
                onClick={handleTailor} 
                disabled={loadingAnalyze || loadingTailor || source === "upload"}
                className={`w-full text-white ${source === "upload" ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                title={source === "upload" ? "Tailoring is only available for Builder Resumes" : ""}
              >
                {loadingTailor ? "Tailoring..." : "2. Auto-Tailor Resume"}
              </Button>
            </div>
            
            {tailorSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex flex-col gap-3">
                <p>✅ Resume successfully tailored! The AI has optimized your summary and experience to match the JD.</p>
                <Button variant="outline" className="w-full bg-white text-green-700 border-green-300 hover:bg-green-100" onClick={() => router.push('/builder')}>
                  View Tailored Resume in Builder
                </Button>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-y-auto max-h-[600px]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Analysis Results</h2>
            
            {!result && !loadingAnalyze && (
              <p className="text-gray-500 text-center mt-10">Run the analysis to see your ATS score.</p>
            )}

            {loadingAnalyze && (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {result && result.error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <p className="font-semibold">Analysis Error</p>
                <p className="text-sm mt-1">{result.error}</p>
              </div>
            )}

            {result && !result.error && (
              <div className="space-y-6">
                
                {/* Score */}
                <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <span className="text-lg font-medium text-indigo-900 dark:text-indigo-200">Overall Match</span>
                  <span className={`text-3xl font-bold ${result.overall_score >= 80 ? 'text-green-600' : result.overall_score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {result.overall_score}%
                  </span>
                </div>

                {/* Sub Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg text-center dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Keywords</div>
                    <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">{result.keyword_match_score}%</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Impact</div>
                    <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">{result.impact_score}%</div>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-3">Actionable Feedback</h3>
                  <ul className="space-y-2">
                    {result.feedback?.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
