import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, KeyRound, CheckCircle, Mail, Lock, ShieldCheck } from "lucide-react";
import { z } from "zod";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

const passwordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetStep = "email" | "otp" | "new-password" | "success";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifiedCode, setVerifiedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<ResetStep>("email");
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (step === "otp") {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = emailSchema.safeParse({ email });
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
      const { data, error } = await supabase.functions.invoke("otp-verification", {
        body: { action: "send_reset", email },
      });

      if (error) throw error;

      toast({
        title: "Reset Code Sent! 📧",
        description: "Check your email for the 6-digit code.",
      });
      setStep("otp");
      setCountdown(60);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send reset code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      verifyOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      verifyOTP(pastedData);
    }
  };

  const verifyOTP = async (code: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("otp-verification", {
        body: { action: "verify_reset", email, code },
      });

      if (error) throw error;

      if (data.success) {
        setVerifiedCode(code);
        toast({
          title: "Code Verified! ✅",
          description: "Now set your new password.",
        });
        setStep("new-password");
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Code",
          description: data.error || "Please check your code and try again.",
        });
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Something went wrong.",
      });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("otp-verification", {
        body: { action: "send_reset", email },
      });

      if (error) throw error;

      toast({
        title: "Code Resent! 📧",
        description: "A new code has been sent to your email.",
      });
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: error.message || "Could not resend code.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = passwordSchema.safeParse({ password, confirmPassword });
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
      const { data, error } = await supabase.functions.invoke("otp-verification", {
        body: { action: "reset_password", email, code: verifiedCode, newPassword: password },
      });

      if (error) throw error;

      if (data.success) {
        setStep("success");
        toast({
          title: "Password Updated! 🎉",
          description: "Your password has been successfully reset.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to update password",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case "email":
        return {
          title: "Forgot Password?",
          description: "Enter your email and we'll send you a reset code",
          icon: <Mail className="w-6 h-6 text-primary" />,
        };
      case "otp":
        return {
          title: "Enter Reset Code",
          description: `We sent a 6-digit code to ${email}`,
          icon: <ShieldCheck className="w-6 h-6 text-primary" />,
        };
      case "new-password":
        return {
          title: "Set New Password",
          description: "Create a strong password for your account",
          icon: <Lock className="w-6 h-6 text-primary" />,
        };
      case "success":
        return {
          title: "Password Reset!",
          description: "Your password has been updated successfully",
          icon: <CheckCircle className="w-6 h-6 text-primary" />,
        };
    }
  };

  const stepContent = getStepContent();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src={alphaLogo} alt="Alokchitra" className="w-12 h-12 object-contain invert" />
            <span className="text-3xl font-bold">Alokchitra</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Reset Your Password
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-md">
            Don't worry! It happens to the best of us. We'll help you regain access to your account securely.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <span>Secure OTP verification</span>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-20 -right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Right Side - Reset Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Back Button */}
          {step !== "success" && (
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => {
                if (step === "email") {
                  navigate("/auth");
                } else if (step === "otp") {
                  setStep("email");
                  setOtp(["", "", "", "", "", ""]);
                } else if (step === "new-password") {
                  setStep("otp");
                }
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === "email" ? "Back to Login" : "Back"}
            </Button>
          )}

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src={alphaLogo} alt="Alokchitra" className="w-10 h-10 object-contain dark:invert" />
            <span className="text-2xl font-bold gradient-text">Alokchitra</span>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {stepContent.icon}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                {stepContent.title}
              </CardTitle>
              <CardDescription className="text-center">
                {stepContent.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Enter Email */}
              {step === "email" && (
                <form onSubmit={handleSendResetCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
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
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: Enter OTP */}
              {step === "otp" && (
                <div className="space-y-6">
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={isLoading}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 focus:border-primary transition-all"
                      />
                    ))}
                  </div>

                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  )}

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?
                    </p>
                    <Button
                      variant="link"
                      onClick={resendCode}
                      disabled={countdown > 0 || isLoading}
                      className="text-primary"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Check your spam folder if you don't see the email
                  </p>
                </div>
              )}

              {/* Step 3: New Password */}
              {step === "new-password" && (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
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
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={errors.confirmPassword ? "border-destructive" : ""}
                      disabled={isLoading}
                    />
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
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              )}

              {/* Step 4: Success */}
              {step === "success" && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Your password has been reset successfully. You can now login with your new password.
                  </p>
                  <Button 
                    className="w-full gradient-primary hover:opacity-90 transition-opacity"
                    onClick={() => navigate("/auth")}
                  >
                    Go to Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {step === "email" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Remember your password?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>
                Back to login
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
