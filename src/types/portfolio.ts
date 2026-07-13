export type Locale = "en" | "vi";

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface ProjectItem {
  index: string;
  title: string;
  context: string;
  description: string;
  contribution: string;
  technologies: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface PortfolioContent {
  locale: Locale;
  languageName: string;
  alternateLanguageLabel: string;
  alternateHref: string;
  metadata: {
    title: string;
    description: string;
  };
  navigation: NavigationItem[];
  hero: {
    eyebrow: string;
    role: string;
    statement: string;
    introduction: string;
    primaryCta: string;
    secondaryCta: string;
    availability: string;
    location: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    principles: Array<{ number: string; title: string; description: string }>;
  };
  experience: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ExperienceItem[];
  };
  projects: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ProjectItem[];
  };
  skills: {
    eyebrow: string;
    title: string;
    intro: string;
    groups: SkillGroup[];
    strengthsTitle: string;
    strengths: string[];
  };
  education: {
    eyebrow: string;
    title: string;
    school: string;
    program: string;
    period: string;
    language: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    emailLabel: string;
    githubLabel: string;
    note: string;
  };
  footer: string;
}
