import { Globe, Github, Linkedin, Twitter, Youtube, Instagram, Facebook } from "lucide-react";

export const getSocialIcon = (platform: string) => {
  const icons: Record<string, typeof Globe> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    instagram: Instagram,
    facebook: Facebook,
  };
  return icons[platform.toLowerCase()] || Globe;
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short" });
};
