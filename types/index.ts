export interface TechStack {
  name: string;
  logoUrl: string;
  invertInDarkMode?: boolean;
  invertInLightMode?: boolean;
}

export interface PersonalInfo {
  name: string;
  profession: string;
  email: string;
  github: string;
  twitter: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  link: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  Livelink?: string;
  gitHubLink: string;
  imageSrc?: string;
  date: string;
  working?: boolean;
}

export interface LastUpdated {
  date: string;
  time: string;
}

export interface UserData {
  personalInfo: PersonalInfo;
  about: string;
  experience: Experience[];
  projects: Project[];
  lastUpdated: LastUpdated;
}

