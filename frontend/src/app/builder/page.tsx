"use client";

import { useResumeStore } from "@/store/resumeStore";
import { LivePreview, ResumeDocument } from "@/components/ResumePDF";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from '@react-pdf/renderer';

export default function ResumeBuilder() {
  const store = useResumeStore();
  const { data } = store;

  const handleAddExperience = () => {
    store.addExperience({
      id: Math.random().toString(36).substr(2, 9),
      company: "", position: "", startDate: "", endDate: "", description: ""
    });
  };

  const handleAddEducation = () => {
    store.addEducation({
      id: Math.random().toString(36).substr(2, 9),
      institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: ""
    });
  };

  const handleAddSkill = () => {
    store.addSkill({
      id: Math.random().toString(36).substr(2, 9),
      name: "", level: ""
    });
  };

  const handleAddProject = () => {
    store.addProject({
      id: Math.random().toString(36).substr(2, 9),
      name: "", description: "", link: ""
    });
  };

  const handleAddCertification = () => {
    store.addCertification({
      id: Math.random().toString(36).substr(2, 9),
      name: "", issuer: "", date: ""
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Editor Panel */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r dark:border-gray-700 pb-32">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Resume Builder</h1>
          
          {typeof window !== "undefined" && (
            <PDFDownloadLink document={<ResumeDocument data={data} />} fileName="resume.pdf">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Save & Download PDF
              </Button>
            </PDFDownloadLink>
          )}
        </div>
        
        {/* Personal Info */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Personal Information</h2>
          <div className="space-y-4">
            <input 
              placeholder="Full Name" 
              value={data.personalInfo.fullName}
              onChange={(e) => store.updatePersonalInfo({ fullName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input 
              placeholder="Email" 
              value={data.personalInfo.email}
              onChange={(e) => store.updatePersonalInfo({ email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input 
              placeholder="Phone" 
              value={data.personalInfo.phone}
              onChange={(e) => store.updatePersonalInfo({ phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input 
              placeholder="LinkedIn URL" 
              value={data.personalInfo.linkedin}
              onChange={(e) => store.updatePersonalInfo({ linkedin: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input 
              placeholder="Address (City, State, Country)" 
              value={data.personalInfo.address}
              onChange={(e) => store.updatePersonalInfo({ address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex gap-4 w-full">
              <input 
                placeholder="GitHub URL" 
                value={data.personalInfo.github}
                onChange={(e) => store.updatePersonalInfo({ github: e.target.value })}
                className="w-1/2 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input 
                placeholder="Portfolio URL" 
                value={data.personalInfo.portfolio}
                onChange={(e) => store.updatePersonalInfo({ portfolio: e.target.value })}
                className="w-1/2 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Professional Summary</h2>
          <textarea 
            placeholder="Write a brief summary about yourself..." 
            value={data.summary}
            onChange={(e) => store.updateSummary(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={4}
          />
        </section>

        {/* Experience Info */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Experience</h2>
            <Button onClick={handleAddExperience} variant="outline" size="sm">+ Add</Button>
          </div>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="p-4 border rounded-lg dark:border-gray-700 relative group">
                <button onClick={() => store.removeExperience(exp.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition">Remove</button>
                <div className="space-y-3">
                  <input placeholder="Company" value={exp.company} onChange={(e) => store.updateExperience(exp.id, { company: e.target.value })} className="w-full px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  <input placeholder="Position" value={exp.position} onChange={(e) => store.updateExperience(exp.id, { position: e.target.value })} className="w-full px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  <div className="flex gap-2">
                    <input placeholder="Start Date" value={exp.startDate} onChange={(e) => store.updateExperience(exp.id, { startDate: e.target.value })} className="w-1/2 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <input placeholder="End Date" value={exp.endDate} onChange={(e) => store.updateExperience(exp.id, { endDate: e.target.value })} className="w-1/2 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <textarea placeholder="Description" value={exp.description} onChange={(e) => store.updateExperience(exp.id, { description: e.target.value })} className="w-full px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Info */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Education</h2>
            <Button onClick={handleAddEducation} variant="outline" size="sm">+ Add</Button>
          </div>
          <div className="space-y-6">
            {data.education.map((edu) => (
              <div key={edu.id} className="p-4 border rounded-lg dark:border-gray-700 relative group">
                <button onClick={() => store.removeEducation(edu.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition">Remove</button>
                <div className="space-y-3">
                  <input placeholder="Institution" value={edu.institution} onChange={(e) => store.updateEducation(edu.id, { institution: e.target.value })} className="w-full px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  <div className="flex gap-2">
                    <input placeholder="Degree (e.g. BS)" value={edu.degree} onChange={(e) => store.updateEducation(edu.id, { degree: e.target.value })} className="w-1/3 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <input placeholder="Field of Study" value={edu.fieldOfStudy} onChange={(e) => store.updateEducation(edu.id, { fieldOfStudy: e.target.value })} className="w-2/3 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div className="flex gap-2">
                    <input placeholder="Start Date" value={edu.startDate} onChange={(e) => store.updateEducation(edu.id, { startDate: e.target.value })} className="w-1/2 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <input placeholder="End Date" value={edu.endDate} onChange={(e) => store.updateEducation(edu.id, { endDate: e.target.value })} className="w-1/2 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <textarea placeholder="Description / Honors" value={edu.description} onChange={(e) => store.updateEducation(edu.id, { description: e.target.value })} className="w-full px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={2} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Info */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Projects</h2>
            <Button onClick={handleAddProject} variant="outline" size="sm">+ Add</Button>
          </div>
          <div className="space-y-6">
            {data.projects.map((proj) => (
              <div key={proj.id} className="p-4 border rounded-lg dark:border-gray-700 relative group">
                <button onClick={() => store.removeProject(proj.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition">Remove</button>
                <div className="space-y-3">
                  <input placeholder="Project Name" value={proj.name} onChange={(e) => store.updateProject(proj.id, { name: e.target.value })} className="w-full px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  <input placeholder="Link / URL" value={proj.link} onChange={(e) => store.updateProject(proj.id, { link: e.target.value })} className="w-full px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  <textarea placeholder="Description" value={proj.description} onChange={(e) => store.updateProject(proj.id, { description: e.target.value })} className="w-full px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Info */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Skills</h2>
            <Button onClick={handleAddSkill} variant="outline" size="sm">+ Add</Button>
          </div>
          <div className="space-y-3">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex gap-2 relative group">
                <input placeholder="Skill Name" value={skill.name} onChange={(e) => store.updateSkill(skill.id, { name: e.target.value })} className="flex-1 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <input placeholder="Level (e.g. Expert, Familiar)" value={skill.level} onChange={(e) => store.updateSkill(skill.id, { level: e.target.value })} className="flex-1 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={() => store.removeSkill(skill.id)} className="px-3 text-red-500">✕</button>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Info */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Certifications</h2>
            <Button onClick={handleAddCertification} variant="outline" size="sm">+ Add</Button>
          </div>
          <div className="space-y-6">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="p-4 border rounded-lg dark:border-gray-700 relative group">
                <button onClick={() => store.removeCertification(cert.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition">Remove</button>
                <div className="space-y-3">
                  <input placeholder="Certification Name" value={cert.name} onChange={(e) => store.updateCertification(cert.id, { name: e.target.value })} className="w-full px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  <div className="flex gap-2">
                    <input placeholder="Issuer" value={cert.issuer} onChange={(e) => store.updateCertification(cert.id, { issuer: e.target.value })} className="w-1/2 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <input placeholder="Date" value={cert.date} onChange={(e) => store.updateCertification(cert.id, { date: e.target.value })} className="w-1/2 px-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Live Preview Panel */}
      <div className="w-full md:w-1/2 p-6 bg-gray-100 dark:bg-gray-800 flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-[800px] h-full min-h-[800px] shadow-2xl rounded-lg sticky top-6">
          <LivePreview data={data} />
        </div>
      </div>

    </div>
  );
}
