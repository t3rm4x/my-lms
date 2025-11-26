import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { verifyMfaCode, resendMfaCode } from "@/services/mfa";

const MfaVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get username from location state (passed from Login page)
  const username = (location.state as { username?: string })?.username;
  
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no username provided
  useEffect(() => {
    if (!username) {
      toast.error("Session expired", { description: "Please login again" });
      navigate("/login");
    }
  }, [username, navigate]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // If current is empty, move to previous
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
    
    // Handle left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle right arrow
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Check if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      
      // Focus last input
      inputRefs.current[5]?.focus();
      
      // Auto-submit
      handleVerify(pastedData);
    } else {
      toast.error("Invalid code", { description: "Please paste a 6-digit code" });
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const mfaCode = fullCode || code.join("");
    
    if (mfaCode.length !== 6) {
      toast.error("Invalid code", { description: "Please enter all 6 digits" });
      return;
    }

    if (!username) {
      toast.error("Session expired", { description: "Please login again" });
      navigate("/login");
      return;
    }

    setLoading(true);

    const result = await verifyMfaCode({ username, mfaCode });

    setLoading(false);

    if (result.success) {
      toast.success("Login Successful!", { description: "Redirecting to dashboard..." });
      navigate("/dashboard", { replace: true });
    } else {
      // Handle specific error codes
      if (result.code === "INVALID_MFA_CODE") {
        toast.error("Invalid Code", { description: "Please check your email and try again" });
        // Clear the code inputs
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else if (result.code === "MFA_CODE_EXPIRED") {
        toast.error("Code Expired", { 
          description: "Your code has expired. Please request a new one" 
        });
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleResend = async () => {
    if (!username) return;

    setResending(true);

    const result = await resendMfaCode({ username });

    setResending(false);

    if (result.success) {
      toast.success("Code Sent!", { description: "Check your email for a new code" });
      // Clear existing code
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-primary cyber-glow animate-pulse-glow" />
              <Mail className="h-6 w-6 text-primary absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-mono cyber-glow">VERIFY LOGIN</h1>
          <p className="text-muted-foreground mt-2">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border cyber-border rounded-lg p-8">
          <div className="space-y-6">
            
            {/* 6-Digit Code Input */}
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold bg-input border-2 border-border focus:border-primary rounded-lg font-mono cyber-border transition-all focus:scale-105 focus:outline-none"
                    disabled={loading}
                  />
                ))}
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Code expires in 5 minutes
              </p>
            </div>

            {/* Verify Button */}
            <Button
              onClick={() => handleVerify()}
              disabled={loading || code.join("").length !== 6}
              className="w-full cyber-border font-mono"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Code
                </>
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                variant="link"
                onClick={handleResend}
                disabled={resending}
                className="font-mono text-primary"
              >
                {resending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="pt-4 border-t border-border">
              <Link to="/login">
                <Button variant="ghost" className="w-full font-mono">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground">
          Logged in as: <span className="font-mono text-primary">{username}</span>
        </p>

      </div>
    </div>
  );
};

export default MfaVerify;
