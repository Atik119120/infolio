import { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle, Star, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { ThemeProps } from "./types";
import { getSocialIcon } from "./utils";

export default function SmallBusinessTheme({
  profile,
  portfolio,
  skills,
  projects,
  socialLinks,
  experiences,
  userId,
}: ThemeProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const name = profile?.display_name || "My Business";
  const tagline = portfolio?.headline || "Locally trusted, customer loved";
  const bio = portfolio?.bio || "";

  return (
    <div
      className="min-h-screen"
      style={{ background: "#fffbf5", color: "#1c1917", fontFamily: "'Nunito', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <header className="bg-white border-b border-amber-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl">
            <Store className="text-green-700" /> {name}
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#home" className="hover:text-green-700">Home</a>
            <a href="#products" className="hover:text-green-700">Products</a>
            <a href="#about" className="hover:text-green-700">About</a>
            <a href="#contact" className="hover:text-green-700">Contact</a>
          </nav>
          {portfolio?.phone && (
            <a href={`https://wa.me/${portfolio.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
              <Button className="rounded-full" style={{ background: "#16a34a" }}>
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Us
              </Button>
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="py-20"
        style={{ background: "linear-gradient(135deg, #fffbf5 0%, #fef3c7 50%, #fffbf5 100%)" }}
      >
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {portfolio?.location && (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mb-5 font-semibold">
                <MapPin className="w-3 h-3" /> {portfolio.location}
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">{name}</h1>
            <p className="text-xl text-amber-900 mb-3 font-semibold">{tagline}</p>
            <p className="text-stone-700 mb-8">{bio}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#products">
                <Button size="lg" className="rounded-full" style={{ background: "#16a34a" }}>See Our Products</Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="rounded-full border-amber-700 text-amber-900 hover:bg-amber-50">Contact Us</Button>
              </a>
            </div>
          </motion.div>
          {profile?.avatar_url && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
              <img
                src={profile.avatar_url}
                alt={name}
                className="w-80 h-80 rounded-3xl object-cover"
                style={{ boxShadow: "0 20px 60px rgba(120,53,15,0.25)" }}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-3">What We Offer</h2>
          <p className="text-center text-stone-600 mb-12">Quality products & services for our community</p>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl overflow-hidden border border-amber-100"
                style={{ boxShadow: "0 10px 30px rgba(120,53,15,0.08)" }}
              >
                {p.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-extrabold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-stone-600 mb-4 line-clamp-2">{p.description}</p>
                  <a href="#contact">
                    <Button size="sm" className="rounded-full w-full" style={{ background: "#16a34a" }}>Inquire</Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20" style={{ background: "rgba(34,197,94,0.06)" }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {skills.slice(0, 4).map((s, i) => (
              <div key={s.id} className="text-center bg-white p-6 rounded-2xl border border-amber-100">
                <div className="text-4xl mb-3">{["🌟", "🤝", "⚡", "💚"][i % 4]}</div>
                <h3 className="font-extrabold mb-2">{s.name}</h3>
                <p className="text-sm text-stone-600">{s.category || "Trusted by our customers"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          {profile?.avatar_url && (
            <img src={profile.avatar_url} alt={name} className="w-full max-w-md rounded-3xl mx-auto" />
          )}
          <div>
            <h2 className="text-4xl font-black mb-5">Our Story</h2>
            <p className="text-stone-700 mb-6 leading-relaxed">{bio}</p>
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-black text-green-700">{experiences.length}+</div>
                <div className="text-sm text-stone-600">Years Serving</div>
              </div>
              <div>
                <div className="text-3xl font-black text-green-700">{projects.length}+</div>
                <div className="text-sm text-stone-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews placeholder using skills */}
      <section className="py-20" style={{ background: "#fef3c7" }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-stone-700 mb-4 italic">"Wonderful service and friendly people. Highly recommended for our community!"</p>
                <div className="font-bold">Happy Customer #{i}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20" style={{ background: "#16a34a", color: "white" }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-black text-center mb-8">Get in Touch</h2>
          {portfolio?.phone && (
            <a
              href={`https://wa.me/${portfolio.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="block max-w-md mx-auto mb-8"
            >
              <Button size="lg" className="w-full rounded-full bg-white text-green-700 hover:bg-amber-50 font-bold text-lg py-7">
                <MessageCircle className="mr-2" /> Chat on WhatsApp
              </Button>
            </a>
          )}
          {userId && (
            <div className="bg-white text-stone-800 rounded-2xl p-6">
              <ContactForm portfolioOwnerId={userId} />
            </div>
          )}
          {portfolio?.location && (
            <p className="text-center mt-6 flex items-center justify-center gap-2"><MapPin className="w-4 h-4" />{portfolio.location}</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10" style={{ background: "#1c1917", color: "#fef3c7" }}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-extrabold text-lg">{name}</div>
            <div className="text-sm opacity-70">{tagline}</div>
          </div>
          <div className="flex gap-3">
            {socialLinks.map((s) => {
              const Icon = getSocialIcon(s.platform);
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20">
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
          <div className="text-sm opacity-70">© {new Date().getFullYear()} {name}</div>
        </div>
      </footer>
    </div>
  );
}
