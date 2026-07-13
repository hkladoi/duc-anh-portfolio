export type Locale = "en" | "vi";

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  projectOverview: string;
  responsibilities: string;
  technologies: string[];
}

export interface PortfolioContent {
  locale: Locale;
  alternateLanguageLabel: string;
  alternateHref: string;
  metadata: {
    title: string;
    description: string;
  };
  navigation: NavigationItem[];
  introduction: {
    label: string;
    name: string;
    role: string;
    statement: string;
    body: string;
    location: string;
    availability: string;
  };
  contact: {
    label: string;
    title: string;
    body: string;
    email: string;
    github: string;
    emailLabel: string;
    githubLabel: string;
    cvLabel: string;
  };
  experience: {
    label: string;
    title: string;
    items: ExperienceItem[];
  };
  project: {
    label: string;
    title: string;
    type: string;
    description: string;
    visitLabel: string;
    url: string;
  };
  footer: string;
}
