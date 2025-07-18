export interface ReleasePost {
  id: string;
  title: string;
  fullContent: string;
  date: { _seconds: number; _nanoseconds: number };
  version: string;
  tags: string[];
  image: string;}

export interface DashboardMainProps {
  darkMode: boolean;
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
}