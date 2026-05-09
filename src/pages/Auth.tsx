import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, ArrowLeft, Phone, Mail, User, Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { z } from "zod";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";
import { isDisposableEmail, isAllowedEmailDomain } from "@/lib/tempEmailValidator";
import { OTPVerification } from "@/components/auth/OTPVerification";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a-z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number (0-9)", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character (!@#$...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const signupSchema = z.object({
  username: z.string().trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be less than 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  email: z.string().trim()
    .email({ message: "Invalid email address" })
    .refine((email) => !isDisposableEmail(email), {
      message: "Temporary/disposable email addresses are not allowed",
    })
    .refine((email) => isAllowedEmailDomain(email), {
      message: "Only Gmail addresses are allowed (e.g., yourname@gmail.com)",
    }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" })
    .regex(/[^A-Za-z0-9]/, { message: "Must include a special character" }),
  confirmPassword: z.string(),
  phone: z.string().trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must be less than 15 digits" })
    .regex(/^[+]?[0-9]+$/, { message: "Phone number can only contain numbers and optional + prefix" }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOTP, setShowOTP] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    const checkAdminAndRedirect = async () => {
      if (user) {
        // Check if user is admin
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (adminRole) {
          // Admin goes to admin panel
          navigate("/admin", { replace: true });
        } else {
          // Regular user goes to dashboard
          navigate(from, { replace: true });
        }
      }
    };

    checkAdminAndRedirect();
  }, [user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
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

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again."
          : error.message,
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse({ username, email, password, confirmPassword, phone });
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

    setIsLoading(true);
    // Step 1: Send OTP code via Resend (no account created yet)
    const { data, error: otpError } = await supabase.functions.invoke("otp-verification", {
      body: { action: "send", email, userName: username },
    });
    setIsLoading(false);

    if (otpError || (data && data.error)) {
      const msg = (data?.error || otpError?.message || "").toString();
      toast({
        variant: "destructive",
        title: "Could not send code",
        description: msg || "Please try again in a moment.",
      });
      return;
    }

    toast({
      title: "Code sent! 📧",
      description: "Check your Gmail inbox for a 6-digit verification code.",
    });
    setShowOTP(true);
  };

  const handleOTPVerified = async () => {
    // Step 2: After OTP verified, actually create the account
    const { error } = await signUp(email, password, username, phone);

    if (error) {
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes("already registered") || errorMsg.includes("already been registered")) {
        toast({
          variant: "destructive",
          title: "Account exists",
          description: "This email is already registered. Please login instead.",
        });
      } else if (errorMsg.includes("username") || errorMsg.includes("duplicate key") || errorMsg.includes("profiles_username_key")) {
        toast({
          variant: "destructive",
          title: "Username taken",
          description: "This username is already in use. Please choose a different one.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: error.message,
        });
      }
      setShowOTP(false);
      return;
    }

    toast({
      title: "Account Created! 🎉",
      description: "Your account is pending admin approval. You can login once approved.",
    });
    await supabase.auth.signOut();
    setShowOTP(false);
    setActiveTab("login");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Back to home */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-border/60 text-sm text-foreground hover:bg-muted transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Home
      </button>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src={alphaLogo} alt="Alokchitra" className="h-12 w-auto object-contain invert" />
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Build Your Professional Portfolio in Minutes
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-md">
            No coding required. Create a stunning portfolio website that showcases your work and helps you stand out.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span>Beautiful, modern templates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span>Custom subdomain included</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span>Admin approval for quality</span>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-20 -right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src={alphaLogo} alt="Alokchitra" className="h-10 w-auto object-contain invert" />
          </div>

          {showOTP ? (
            <OTPVerification
              email={email}
              userName={username}
              onVerified={handleOTPVerified}
              onBack={() => setShowOTP(false)}
            />
          ) : (
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">
                {activeTab === "login" ? "Welcome back" : "Create an account"}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login" 
                  ? "Enter your credentials to access your dashboard" 
                  : "Start building your professional portfolio today"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Password
                        </Label>
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 h-auto text-xs text-muted-foreground hover:text-primary"
                          onClick={() => navigate("/reset-password")}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showLoginPwd ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPwd((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                          aria-label={showLoginPwd ? "Hide password" : "Show password"}
                        >
                          {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full gradient-primary hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-username" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                      </Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={errors.username ? "border-destructive" : ""}
                        disabled={isLoading}
                      />
                      {errors.username && (
                        <p className="text-sm text-destructive">{errors.username}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        This will be your portfolio URL: yourname.alokchitra.site
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Gmail Address
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Only Gmail addresses are accepted
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+8801XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={errors.phone ? "border-destructive" : ""}
                        disabled={isLoading}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showSignupPwd ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPwd((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                          aria-label={showSignupPwd ? "Hide password" : "Show password"}
                        >
                          {showSignupPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {password.length > 0 && (
                        <ul className="mt-2 space-y-1 rounded-md bg-muted/40 p-2.5">
                          {passwordRules.map((rule) => {
                            const ok = rule.test(password);
                            return (
                              <li
                                key={rule.label}
                                className={`flex items-center gap-2 text-xs transition-colors ${
                                  ok ? "text-green-600" : "text-muted-foreground"
                                }`}
                              >
                                {ok ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <X className="w-3.5 h-3.5" />
                                )}
                                {rule.label}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPwd ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPwd((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                          aria-label={showConfirmPwd ? "Hide password" : "Show password"}
                        >
                          {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPassword.length > 0 && password !== confirmPassword && !errors.confirmPassword && (
                        <p className="text-sm text-destructive">Passwords do not match</p>
                      )}
                      {confirmPassword.length > 0 && password === confirmPassword && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Passwords match
                        </p>
                      )}
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full gradient-primary hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      After signup, your account will need admin approval before you can publish your portfolio.
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}