import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { ThemeProps } from "./types";
import { 
  Mail, MapPin, Phone, Globe, ExternalLink, Github,
  Star, Sparkles, Orbit, Moon, Sun, Rocket, Atom,
  Calendar, Building2, GraduationCap, ChevronRight
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getSocialIcon } from "./utils";

// Lazy load 3D scene for performance
const SpaceScene = lazy(() => import("./cosmic/SpaceScene"));

// Cosmic color palette
const cosmicColors = {
  nebula: "from-purple-600 via-pink-500 to-orange-400",
  galaxy: "from-indigo-900 via-purple-900 to-black",
  aurora: "from-teal-400 via-cyan-500 to-blue-600",
  stardust: "from-amber-200 via-yellow-300 to-orange-400",
  void: "from-slate-950 via-indigo-950 to-purple-950",
};

// Floating stars component
const FloatingStars = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Orbiting planets component
const OrbitingPlanets = () => {
  const planets = [
    { color: "bg-gradient-to-br from-orange-400 to-red-600", size: 12, orbit: 150, duration: 20, hasRing: false },
    { color: "bg-gradient-to-br from-blue-400 to-cyan-600", size: 8, orbit: 200, duration: 15, hasRing: false },
    { color: "bg-gradient-to-br from-amber-300 to-yellow-500", size: 16, orbit: 280, duration: 30, hasRing: true },
    { color: "bg-gradient-to-br from-teal-400 to-emerald-600", size: 10, orbit: 350, duration: 25, hasRing: false },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {planets.map((planet, idx) => (
        <motion.div
          key={idx}
          className="absolute left-1/2 top-1/2"
          animate={{ rotate: 360 }}
          transition={{
            duration: planet.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: planet.orbit * 2,
            height: planet.orbit * 2,
            marginLeft: -planet.orbit,
            marginTop: -planet.orbit,
          }}
        >
          {/* Orbit path */}
          <div 
            className="absolute inset-0 rounded-full border border-white/10"
          />
          {/* Planet */}
          <div 
            className={`absolute ${planet.color} rounded-full shadow-lg shadow-white/20`}
            style={{
              width: planet.size,
              height: planet.size,
              top: 0,
              left: "50%",
              marginLeft: -planet.size / 2,
              marginTop: -planet.size / 2,
            }}
          >
            {planet.hasRing && (
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-amber-200/50 rounded-full"
                style={{ width: planet.size * 2, height: planet.size * 0.5 }}
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Nebula background effect
const NebulaEffect = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-transparent"
      style={{ top: "-20%", right: "-10%" }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.35, 0.2],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent"
      style={{ bottom: "-10%", left: "-5%" }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.15, 0.3, 0.15],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-transparent"
      style={{ top: "40%", left: "30%" }}
      animate={{
        scale: [1, 1.2, 1],
        x: [-20, 20, -20],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Shooting star animation
const ShootingStars = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${10 + i * 20}%`,
            left: "-5%",
            boxShadow: "0 0 6px 2px rgba(255,255,255,0.6)",
          }}
          animate={{
            x: ["0vw", "120vw"],
            y: ["0vh", "50vh"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 4 + 2,
            repeat: Infinity,
            repeatDelay: 8,
            ease: "easeOut",
          }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-[2px] bg-gradient-to-r from-white to-transparent" />
        </motion.div>
      ))}
    </div>
  );
};

export default function CosmicTheme({
  profile,
  portfolio,
  skills,
  projects,
  experiences,
  education,
  socialLinks,
}: ThemeProps) {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 text-white overflow-hidden">
      {/* 3D Space Scene Background */}
      <Suspense fallback={null}>
        <SpaceScene />
      </Suspense>
      
      <FloatingStars />
      <ShootingStars />
      <NebulaEffect />

      {/* Hero Section - Solar System Style */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Remove old 2D orbiting planets since we have 3D now */}
        
        {/* Central Sun (Profile) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          {/* Glowing Sun Effect */}
          <div className="relative mb-8 mx-auto w-fit">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 blur-2xl opacity-60"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -inset-4 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <Avatar className="w-40 h-40 ring-4 ring-amber-400/50 shadow-2xl shadow-amber-500/30 relative z-10">
              <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-amber-400 to-orange-600 text-white">
                {profile?.display_name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name with cosmic styling */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span className="text-sm tracking-[0.3em] uppercase text-purple-300 font-medium">
                Welcome to my universe
              </span>
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
              {profile?.display_name || "Cosmic Creator"}
            </h1>
            
            <motion.p
              className="text-xl md:text-2xl text-purple-200/90 max-w-2xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {portfolio?.headline || "Exploring the infinite possibilities of creation"}
            </motion.p>
          </motion.div>

          {/* Contact Info - Floating Badges */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {portfolio?.location && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg"
              >
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white/90">{portfolio.location}</span>
              </motion.div>
            )}
            {profile?.email && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg"
              >
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white/90">{profile.email}</span>
              </motion.div>
            )}
            {portfolio?.website && (
              <motion.a
                href={portfolio.website}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg cursor-pointer"
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-white/90">Website</span>
              </motion.a>
            )}
          </motion.div>

          {/* Social Links - Constellation Style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-4"
          >
            {socialLinks.map((link, idx) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3 + idx * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:border-amber-400/50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-white/90" />
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Rocket className="w-6 h-6 text-amber-400 rotate-180" />
          <span className="text-xs text-purple-300 tracking-widest uppercase">Explore</span>
        </motion.div>
      </section>

      {/* About Section - Nebula Card */}
      {portfolio?.bio && (
        <section className="relative py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 rounded-3xl blur-lg opacity-30" />
              <div className="relative bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-10 md:p-14 border border-white/10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Atom className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    About My Universe
                  </h2>
                </div>
                <p className="text-lg text-purple-100/90 leading-relaxed">
                  {portfolio.bio}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Skills Section - Constellation Map */}
      {skills.length > 0 && (
        <section className="relative py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-purple-300 tracking-wide">Skill Constellation</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Powers & Abilities
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills], catIdx) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-5">
                      <Orbit className="w-5 h-5 text-purple-400" />
                      <h3 className="font-semibold text-white">{category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill, idx) => (
                        <motion.div
                          key={skill.id}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                          className="relative"
                        >
                          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm">
                            <span className="text-sm text-purple-100">{skill.name}</span>
                          </div>
                          {/* Skill glow on hover */}
                          <motion.div
                            className="absolute inset-0 rounded-full bg-purple-400/20 blur-md -z-10"
                            whileHover={{ opacity: 1, scale: 1.2 }}
                            initial={{ opacity: 0 }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section - Space Stations */}
      {projects.length > 0 && (
        <section className="relative py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Rocket className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300 tracking-wide">Mission Control</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Space Projects
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                  
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                    {/* Project Image */}
                    <div className="relative h-56 overflow-hidden">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
                          <Rocket className="w-16 h-16 text-purple-400/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      
                      {/* Featured badge */}
                      {project.featured && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm">
                          <Star className="w-3.5 h-3.5 text-white fill-white" />
                          <span className="text-xs font-medium text-white">Featured</span>
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-purple-200/70 text-sm mb-5 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {project.tech_stack.map((tech, techIdx) => (
                            <span
                              key={techIdx}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-cyan-300 border border-cyan-400/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex gap-3">
                        {project.live_url && (
                          <motion.a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Launch
                          </motion.a>
                        )}
                        {project.github_url && (
                          <motion.a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            Source
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section - Timeline Trajectory */}
      {experiences.length > 0 && (
        <section className="relative py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-300 tracking-wide">Career Trajectory</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Space Missions
              </h2>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-purple-500 to-transparent" />

              {experiences.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative flex items-center mb-12 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 -translate-x-1/2 z-10 shadow-lg shadow-amber-500/50">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-amber-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Content */}
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-2 text-amber-400 text-sm mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {exp.start_date?.substring(0, 4)} - {exp.is_current ? "Present" : exp.end_date?.substring(0, 4)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{exp.position}</h3>
                        <p className="text-purple-300 mb-3">{exp.company}</p>
                        {exp.description && (
                          <p className="text-purple-200/70 text-sm">{exp.description}</p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section className="relative py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <GraduationCap className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-teal-300 tracking-wide">Knowledge Base</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-300 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Training Academy
              </h2>
            </motion.div>

            <div className="grid gap-6">
              {education.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="group"
                >
                  <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-teal-400/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{edu.degree}</h3>
                        {edu.field_of_study && (
                          <p className="text-teal-300 mb-2">{edu.field_of_study}</p>
                        )}
                        <p className="text-purple-200/70">{edu.institution}</p>
                        <div className="flex items-center gap-2 text-sm text-purple-300/60 mt-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {edu.start_date?.substring(0, 4)} - {edu.is_current ? "Present" : edu.end_date?.substring(0, 4)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-purple-400/50 group-hover:text-teal-400 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer - Space Station */}
      <footer className="relative py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Moon className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300/80 text-sm">
              Crafted in the cosmos • {new Date().getFullYear()}
            </span>
            <Sun className="w-5 h-5 text-amber-400" />
          </motion.div>
          
          {/* Social links */}
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-400/50 transition-colors"
                >
                  <Icon className="w-4 h-4 text-white/70" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
