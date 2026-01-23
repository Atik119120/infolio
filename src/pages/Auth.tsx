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
import { Loader2, ArrowRight, Phone, Mail, User, Lock } from "lucide-react";
import { z } from "zod";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";
import { OTPVerification } from "@/components/auth/OTPVerification";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  username: z.string().trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be less than 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  email: z.string().trim()
    .email({ message: "Invalid email address" })
    .refine((email) => email.endsWith("@gmail.com"), {
      message: "Only Gmail addresses are allowed (e.g., yourname@gmail.com)",
    }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must be less than 15 digits" })
    .regex(/^[+]?[0-9]+$/, { message: "Phone number can only contain numbers and optional + prefix" }),
});

type AuthStep = "form" | "otp-verification";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authStep, setAuthStep] = useState<AuthStep>("form");
  const [pendingSignupData, setPendingSignupData] = useState<{
    email: string;
    password: string;
    username: string;
    phone: string;
  } | null>(null);

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

    const result = signupSchema.safeParse({ username, email, password, phone });
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
    
    try {
      // Send OTP first
      const { data, error: otpError } = await supabase.functions.invoke("otp-verification", {
        body: { action: "send", email, userName: username },
      });

      if (otpError) throw otpError;

      // Store signup data for after verification
      setPendingSignupData({ email, password, username, phone });
      setAuthStep("otp-verification");
      
      toast({
        title: "Verification Code Sent! 📧",
        description: "Check your email for the 6-digit code.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send code",
        description: error.message || "Could not send verification code.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = async () => {
    if (!pendingSignupData) return;

    setIsLoading(true);
    const { error } = await signUp(
      pendingSignupData.email,
      pendingSignupData.password,
      pendingSignupData.username,
      pendingSignupData.phone
    );
    setIsLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          variant: "destructive",
          title: "Account exists",
          description: "This email is already registered. Please login instead.",
        });
        setActiveTab("login");
        setAuthStep("form");
      } else {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: error.message,
        });
        setAuthStep("form");
      }
    } else {
      toast({
        title: "Account Created! 🎉",
        description: "Your account is pending admin approval. You can login and start building your portfolio.",
      });
      setActiveTab("login");
      setAuthStep("form");
      setPendingSignupData(null);
    }
  };

  const handleBackFromOTP = () => {
    setAuthStep("form");
    setPendingSignupData(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src={alphaLogo} alt="Alpha Portfolio" className="w-12 h-12 object-contain invert" />
            <span className="text-3xl font-bold">Alpha Portfolio</span>
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
            <img src={alphaLogo} alt="Alpha Portfolio" className="w-10 h-10 object-contain dark:invert" />
            <span className="text-2xl font-bold gradient-text">Alpha Portfolio</span>
          </div>

          {/* OTP Verification Step */}
          {authStep === "otp-verification" && pendingSignupData && (
            <OTPVerification
              email={pendingSignupData.email}
              userName={pendingSignupData.username}
              onVerified={handleOTPVerified}
              onBack={handleBackFromOTP}
            />
          )}

          {/* Main Auth Form */}
          {authStep === "form" && (
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
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? "border-destructive" : ""}
                        disabled={isLoading}
                      />
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
                        This will be your portfolio URL: yourname.alphaportfolio.com
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
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? "border-destructive" : ""}
                        disabled={isLoading}
                      />
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

          {authStep === "form" && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
          )}
        </div>
      </div>
    </div>
  );
}