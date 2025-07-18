export interface ReleasePost {
  id: number;
  title: string;
  fullContent: string;
  date: { _seconds: number; _nanoseconds: number };
  image: string;
  version: string;
  tags: string[];
}

export interface DashboardMainProps {
  darkMode: boolean;
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
}