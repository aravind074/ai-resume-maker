import { create } from 'zustand';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface ResumeData {
  title: string;
  summary: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

interface ResumeState {
  data: ResumeData;
  setFullResumeData: (data: ResumeData) => void;
  updateSummary: (summary: string) => void;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  addProject: (proj: Project) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;

  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  data: {
    title: "Untitled Resume",
    summary: "",
    personalInfo: { fullName: "", email: "", phone: "", address: "", linkedin: "", github: "", portfolio: "" },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  },
  setFullResumeData: (data) => set({ data }),
  updateSummary: (summary) => set((state) => ({
    data: { ...state.data, summary }
  })),
  updatePersonalInfo: (info) => set((state) => ({
    data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } }
  })),
  
  // Experience
  addExperience: (exp) => set((state) => ({
    data: { ...state.data, experience: [...state.data.experience, exp] }
  })),
  updateExperience: (id, newExp) => set((state) => ({
    data: {
      ...state.data,
      experience: state.data.experience.map(e => e.id === id ? { ...e, ...newExp } : e)
    }
  })),
  removeExperience: (id) => set((state) => ({
    data: {
      ...state.data,
      experience: state.data.experience.filter(e => e.id !== id)
    }
  })),

  // Education
  addEducation: (edu) => set((state) => ({
    data: { ...state.data, education: [...state.data.education, edu] }
  })),
  updateEducation: (id, newEdu) => set((state) => ({
    data: {
      ...state.data,
      education: state.data.education.map(e => e.id === id ? { ...e, ...newEdu } : e)
    }
  })),
  removeEducation: (id) => set((state) => ({
    data: {
      ...state.data,
      education: state.data.education.filter(e => e.id !== id)
    }
  })),

  // Skills
  addSkill: (skill) => set((state) => ({
    data: { ...state.data, skills: [...state.data.skills, skill] }
  })),
  updateSkill: (id, newSkill) => set((state) => ({
    data: {
      ...state.data,
      skills: state.data.skills.map(e => e.id === id ? { ...e, ...newSkill } : e)
    }
  })),
  removeSkill: (id) => set((state) => ({
    data: {
      ...state.data,
      skills: state.data.skills.filter(e => e.id !== id)
    }
  })),

  // Projects
  addProject: (proj) => set((state) => ({
    data: { ...state.data, projects: [...state.data.projects, proj] }
  })),
  updateProject: (id, newProj) => set((state) => ({
    data: {
      ...state.data,
      projects: state.data.projects.map(e => e.id === id ? { ...e, ...newProj } : e)
    }
  })),
  removeProject: (id) => set((state) => ({
    data: {
      ...state.data,
      projects: state.data.projects.filter(e => e.id !== id)
    }
  })),

  // Certifications
  addCertification: (cert) => set((state) => ({
    data: { ...state.data, certifications: [...state.data.certifications, cert] }
  })),
  updateCertification: (id, newCert) => set((state) => ({
    data: {
      ...state.data,
      certifications: state.data.certifications.map(e => e.id === id ? { ...e, ...newCert } : e)
    }
  })),
  removeCertification: (id) => set((state) => ({
    data: {
      ...state.data,
      certifications: state.data.certifications.filter(e => e.id !== id)
    }
  })),
}));
