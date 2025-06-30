export interface ReleasePost {
  id: number;
  title: string;
  description: string;
  fullContent: string;
  date: string;
  version: string;
  image: string;
  category: string;
  author: string;
  tags: string[];
}

export interface DashboardMainProps {
  darkMode: boolean;
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
}