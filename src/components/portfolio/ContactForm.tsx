import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const themedInputReset = {
  outline: "none",
  boxShadow: "none",
  "--tw-ring-color": "transparent",
  "--tw-ring-shadow": "0 0 #0000",
  "--tw-ring-offset-shadow": "0 0 #0000",
} as React.CSSProperties;

const contactSchema = z.object({
  name: z.string().trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  message: z.string().trim()
    .min(1, { message: "Message is required" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

interface ThemeStyle {
  surface?: string;
  border?: string;
  text?: string;
  textMuted?: string;
  accent?: string;
  accentText?: string;
}

interface ContactFormProps {
  portfolioOwnerId: string;
  className?: string;
  variant?: "default" | "personal" | "cosmic" | "official";
  themeStyle?: ThemeStyle;
}

export function ContactForm({ portfolioOwnerId, className = "", variant = "default", themeStyle }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    // Validate inputs
    const result = contactSchema.safeParse({ name, email, message });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_messages").insert({
        portfolio_owner_id: portfolioOwnerId,
        sender_name: result.data.name,
        sender_email: result.data.email,
        message: result.data.message,
      });

      if (error) {
        setSubmitError("Failed to send message. Please try again.");
      } else {
        setIsSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variant-based styling
  const getInputStyles = () => {
    switch (variant) {
      case "personal":
        return "bg-white/80 border-rose-200 focus:border-rose-400 focus:ring-rose-300 rounded-xl";
      case "cosmic":
        return "bg-white/10 border-purple-500/30 focus:border-purple-400 focus:ring-purple-400/50 text-white placeholder:text-white/50 rounded-lg";
      case "official":
        return "bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-300 rounded-lg";
      default:
        return "bg-background border-border focus:border-primary focus:ring-primary rounded-lg";
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case "personal":
        return "rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 shadow-lg shadow-rose-300/30";
      case "cosmic":
        return "rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 shadow-lg shadow-purple-500/30";
      case "official":
        return "rounded-lg bg-slate-900 hover:bg-slate-800";
      default:
        return "rounded-lg bg-primary hover:bg-primary/90";
    }
  };

  const getLabelStyles = () => {
    switch (variant) {
      case "personal":
        return "text-slate-600 font-medium";
      case "cosmic":
        return "text-white/80 font-medium";
      case "official":
        return "text-slate-700 font-medium";
      default:
        return "text-foreground font-medium";
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                variant === "personal" 
                  ? "bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500"
                  : variant === "cosmic"
                  ? "bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600"
                  : "bg-green-500"
              }`}
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className={`text-xl font-semibold mb-2 ${variant === "cosmic" ? "text-white" : "text-foreground"}`}>
              Message Sent!
            </h3>
            <p className={variant === "cosmic" ? "text-white/70" : "text-muted-foreground"}>
              Thank you for reaching out. I'll get back to you soon.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="contact-name"
                  className={getLabelStyles()}
                  style={themeStyle ? { color: themeStyle.text } : undefined}
                >
                  Name
                </Label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${themeStyle ? "rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none" : getInputStyles()} ${errors.name ? "border-destructive" : ""}`}
                  style={
                    themeStyle
                      ? {
                          ...themedInputReset,
                          background: themeStyle.surface,
                          border: `1px solid ${themeStyle.border}`,
                          color: themeStyle.text,
                        }
                      : undefined
                  }
                  disabled={isSubmitting}
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="contact-email"
                  className={getLabelStyles()}
                  style={themeStyle ? { color: themeStyle.text } : undefined}
                >
                  Email
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${themeStyle ? "rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none" : getInputStyles()} ${errors.email ? "border-destructive" : ""}`}
                  style={
                    themeStyle
                      ? {
                          ...themedInputReset,
                          background: themeStyle.surface,
                          border: `1px solid ${themeStyle.border}`,
                          color: themeStyle.text,
                        }
                      : undefined
                  }
                  disabled={isSubmitting}
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contact-message"
                className={getLabelStyles()}
                style={themeStyle ? { color: themeStyle.text } : undefined}
              >
                Message
              </Label>
              <Textarea
                id="contact-message"
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`min-h-[120px] resize-none ${themeStyle ? "rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none" : getInputStyles()} ${errors.message ? "border-destructive" : ""}`}
                style={
                  themeStyle
                    ? {
                        ...themedInputReset,
                        background: themeStyle.surface,
                        border: `1px solid ${themeStyle.border}`,
                        color: themeStyle.text,
                      }
                    : undefined
                }
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                {errors.message ? (
                  <p className="text-sm text-destructive">{errors.message}</p>
                ) : (
                  <span />
                )}
                <span
                  className={`text-xs ${variant === "cosmic" ? "text-white/50" : "text-muted-foreground"}`}
                  style={themeStyle ? { color: themeStyle.textMuted } : undefined}
                >
                  {message.length}/1000
                </span>
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-destructive text-center">{submitError}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className={`w-full ${themeStyle ? "rounded-lg" : getButtonStyles()}`}
              style={
                themeStyle
                  ? {
                      background: themeStyle.accent,
                      color: themeStyle.accentText || "#fff",
                      border: "none",
                    }
                  : undefined
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}