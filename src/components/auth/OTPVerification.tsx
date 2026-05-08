import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  userName: string;
  onVerified: () => void;
  onBack: () => void;
}

export function OTPVerification({ email, userName, onVerified, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 6) {
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
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      verifyOTP(pasted);
    }
  };

  const verifyOTP = async (code: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("otp-verification", {
        body: { action: "verify", email, code },
      });

      if (error || !data?.success) {
        toast({
          variant: "destructive",
          title: "Invalid Code",
          description: data?.error || error?.message || "Please check your code and try again.",
        });
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      setIsVerified(true);
      toast({
        title: "Email Verified! ✅",
        description: "Your email has been verified successfully.",
      });
      setTimeout(() => onVerified(), 1200);
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsResending(true);
    try {
      const { data, error } = await supabase.functions.invoke("otp-verification", {
        body: { action: "send", email, userName },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);

      toast({
        title: "Code Resent! 📧",
        description: "A new verification code has been sent to your email.",
      });
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: error.message || "Could not resend code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Email Verified!</h2>
          <p className="text-muted-foreground">Redirecting to complete your registration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-1 pb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit -ml-2 mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We've sent a 6-digit code to
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
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
          <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
          <Button
            variant="link"
            onClick={resendOTP}
            disabled={countdown > 0 || isResending}
            className="text-primary"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Check your spam folder if you don't see the email
        </p>
      </CardContent>
    </Card>
  );
}
