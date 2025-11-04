import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// 1. Import the new validateSession function
import { validateSession } from "@/services/verify"; 
import { getUser } from "@/utils/auth";
import { Shield, CheckCircle } from "lucide-react";

const Verify = () => {
  const [loading, setLoading] = useState(false);
  const user = getUser();

  // 2. This function now calls the backend to check the session
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await validateSession();

    if (result.success) {
      toast.success(result.message);
      // You might navigate to a profile page or dashboard
      // navigate("/dashboard"); 
    } else {
      toast.error(result.message);
      // If the session is invalid, you might log them out
      // logout();
      // navigate("/login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-primary cyber-glow animate-pulse-glow" />
          </div>
          <h1 className="text-4xl font-bold font-mono cyber-glow">VERIFY SESSION</h1>
          <p className="text-muted-foreground mt-2">
            Click the button to verify your current login session.
          </p>
        </div>

        <div className="bg-card border border-border cyber-border rounded-lg p-8">
          {/* 3. The form is now just a single button */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-center text-muted-foreground">
              Logged in as: {user?.name || "Unknown"} ({user?.id || "..."})
            </p>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-semibold shadow-[0_0_20px_rgba(0,245,255,0.3)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 animate-pulse" />
                  VERIFYING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  CHECK TOKEN
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {/* 4. Removed the "Resend Code" button */}
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