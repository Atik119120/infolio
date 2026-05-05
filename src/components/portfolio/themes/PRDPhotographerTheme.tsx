import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { ThemeProps } from "./types";
import { getSocialIcon } from "./utils";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function PRDPhotographerTheme({
  profile,
  portfolio,
  skills,
  projects,
  socialLinks,
  userId,
}: ThemeProps) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroImages = projects.map((p) => p.image_url).filter(Boolean).slice(0, 5) as string[];
  const galleryImages = projects.filter((p) => p.image_url);

  useEffect(() => {
    if (heroImages.length < 2) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  const name = profile?.display_name || "Photographer";
  const bio = portfolio?.bio || "";

  return (
    <div className="min-h-screen text-white" style={{ background: "#080808", fontFamily: "'Lato', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
        .serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur bg-black/30 py-5">
        <div className="text-center">
          <div className="serif text-3xl tracking-[0.3em]" style={{ color: "#c9a84c" }}>{name.toUpperCase()}</div>
          <nav className="flex justify-center gap-8 mt-2 text-xs tracking-widest uppercase">
            <a href="#portfolio" className="hover:text-[#c9a84c]">Portfolio</a>
            <a href="#about" className="hover:text-[#c9a84c]">About</a>
            <a href="#services" className="hover:text-[#c9a84c]">Services</a>
            <a href="#contact" className="hover:text-[#c9a84c]">Book Now</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {heroImages[heroIdx] && (
            <motion.div
              key={heroIdx}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img src={heroImages[heroIdx]} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="serif text-6xl md:text-8xl mb-3" style={{ color: "#c9a84c" }}>{name}</motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-sm tracking-[0.4em] uppercase mb-10">Photography</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
            <a href="#portfolio">
              <Button variant="outline" className="rounded-none border-white text-white bg-transparent hover:bg-white hover:text-black tracking-widest px-8">VIEW PORTFOLIO</Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section id="portfolio" className="py-20">
        <h2 className="serif text-5xl text-center mb-3" style={{ color: "#c9a84c" }}>Portfolio</h2>
        <p className="text-center text-sm uppercase tracking-widest text-white/50 mb-12">A Selection of Recent Work</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {galleryImages.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setLightbox(i)}
              className="group relative cursor-pointer overflow-hidden aspect-square"
            >
              <img src={p.image_url!} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/40 transition flex items-end p-6 opacity-0 group-hover:opacity-100">
                <div>
                  <div className="serif text-2xl">{p.title}</div>
                  <div className="text-xs uppercase tracking-widest">{p.tech_stack?.[0] || "Photography"}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && galleryImages[lightbox] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6">
            <button className="absolute top-6 right-6 text-white" onClick={() => setLightbox(null)}><X /></button>
            <button className="absolute left-6 text-white" onClick={() => setLightbox((i) => (i! - 1 + galleryImages.length) % galleryImages.length)}><ChevronLeft className="w-8 h-8" /></button>
            <img src={galleryImages[lightbox].image_url!} className="max-w-full max-h-full object-contain" alt="" />
            <button className="absolute right-6 text-white" onClick={() => setLightbox((i) => (i! + 1) % galleryImages.length)}><ChevronRight className="w-8 h-8" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About */}
      <section
        id="about"
        className="relative py-32 bg-cover bg-center"
        style={{
          backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : undefined,
          backgroundColor: "#111",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative container mx-auto px-6 text-center max-w-3xl">
          <h2 className="serif text-5xl mb-6" style={{ color: "#c9a84c" }}>The Story Behind the Lens</h2>
          <div className="w-24 h-px mx-auto mb-8" style={{ background: "#c9a84c" }} />
          <p className="serif text-xl italic leading-relaxed text-white/90">{bio}</p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20" style={{ background: "#f2f2f2", color: "#111" }}>
        <div className="container mx-auto px-6">
          <h2 className="serif text-5xl text-center mb-12" style={{ color: "#c9a84c" }}>What I Offer</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Array.from(new Set(skills.map((s) => s.category || "Photography"))).slice(0, 3).map((cat) => (
              <div key={cat} className="border border-stone-300 p-8 text-center">
                <h3 className="serif text-2xl mb-3">{cat}</h3>
                <p className="text-sm text-stone-600 mb-6">Professional {cat.toLowerCase()} sessions, crafted with care and an artist's eye.</p>
                <a href="#contact"><Button variant="outline" className="rounded-none border-black text-black hover:bg-black hover:text-white">Inquire</Button></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="serif text-5xl text-center mb-12" style={{ color: "#c9a84c" }}>Specialties</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {skills.map((s) => (
              <span key={s.id} className="serif text-xl px-6 py-2 border" style={{ borderColor: "#c9a84c", color: "#c9a84c" }}>{s.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <div className="serif text-7xl mb-4" style={{ color: "#c9a84c" }}>"</div>
          <p className="serif text-2xl italic mb-6">An incredible eye and a calm presence behind the camera. The photos exceeded every expectation we had.</p>
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#c9a84c] text-[#c9a84c]" />)}
          </div>
          <div className="text-sm uppercase tracking-widest text-white/60">A Recent Client</div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="serif text-5xl text-center mb-3" style={{ color: "#c9a84c" }}>Let's Capture Your Story</h2>
          <div className="w-24 h-px mx-auto mb-10" style={{ background: "#c9a84c" }} />
          {userId && (
            <div className="bg-white/5 p-8 backdrop-blur">
              <ContactForm portfolioOwnerId={userId} />
            </div>
          )}
          <div className="flex justify-center gap-3 mt-8">
            {socialLinks.map((s) => {
              const Icon = getSocialIcon(s.platform);
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="w-10 h-10 border flex items-center justify-center hover:bg-[#c9a84c] hover:text-black transition" style={{ borderColor: "#c9a84c", color: "#c9a84c" }}>
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/10 text-center text-xs text-white/50 uppercase tracking-widest">
        © {new Date().getFullYear()} {name} — All Rights Reserved
      </footer>
    </div>
  );
}
