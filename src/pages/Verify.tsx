import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // We'll use this for the OTP
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, CheckCircle } from "lucide-react";

// 1. We import our NEW, REAL verification services
import { verifyEmailCode, resendVerificationCode } from "@/services/verify";

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 2. We "catch" the username from the previous page (Login or Register)
  const username = location.state?.username;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // 3. This is the "gatekeeper"
  // If no username was passed, this page is useless. Go back to login.
  useEffect(() => {
    if (!username) {
      toast.error("No user to verify. Please log in first.");
      navigate("/login");
    }
  }, [username, navigate]);

  // 4. This is the new, "smart" submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await verifyEmailCode(username, code);

    setLoading(false);

    if (result.success) {
      toast.success(result.message, {
        description: "You can now log in with your credentials."
      });
      navigate("/login"); // Success! Send them to login.
    } else {
      toast.error(result.message); // e.g., "Invalid OTP", "OTP has expired"
    }
  };

  // 5. This is the new, "smart" resend
  const handleResend = async () => {
    // Additional validation
    if (!username) {
      toast.error("Username is missing. Please try logging in again.");
      navigate("/login");
      return;
    }

    setResending(true);
    console.log('Attempting to resend verification code for username:', username);
    
    const result = await resendVerificationCode(username);

    if (result.success) {
      toast.success(result.message); // "Verification code sent successfully."
    } else {
      toast.error(result.message);
    }
    
    setResending(false);
  };

  // A simple input for the OTP
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 6) {
      setCode(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-primary cyber-glow animate-pulse-glow" />
          </div>
          <h1 className="text-4xl font-bold font-mono cyber-glow">VERIFY YOUR EMAIL</h1>
          <p className="text-muted-foreground mt-2">
            A 6-digit code was sent to the email for <span className="text-primary font-mono">{username || "..."}</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border cyber-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 6. This is now a real OTP input */}
            <div className="space-y-2">
              <Label htmlFor="code" className="font-mono">Verification Code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="123456"
                value={code}
                onChange={handleCodeChange}
                required
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-primary ... (button styles)"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 animate-pulse" />
                  VERIFYING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  VERIFY
                </span>
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-muted-foreground hover:text-secondary font-mono"
            >
              {resending ? "Sending..." : "Resend Code"}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              <Link to="/login" className="text-primary hover:text-primary/80 font-mono font-semibold">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;