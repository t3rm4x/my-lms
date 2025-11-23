import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Lock, LogIn } from "lucide-react";

// 1. We import our new "smart" loginUser service
import { loginUser } from "@/services/login"; 

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 2. Your backend login.js REQUIRES 'username'.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- 3. THIS IS THE NEW "SMART" HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginUser({ username, password });

    setLoading(false);

    if (result.success) {
      // --- Case 1: Perfect Login ---
      toast.success("Login Successful!", { description: "Redirecting..." });
      // If user was redirected to login from a protected route, return them there
      type LocationState = { from?: { pathname?: string } } | null;
      const locState = location.state as LocationState;
      const from = locState?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } else {
      // --- Case 2: The *NEW* MFA Flow ---
      // Our backend login.js sent this special code
      if (result.code === 'EMAIL_NOT_VERIFIED') {
        toast.error(result.message, {
          description: "You will be redirected to the verification page."
        });
        
        // CRITICAL: We pass the username to the /verify page
        // so it knows *who* to verify.
        navigate('/verify', { state: { username: username } });

      } else {
        // --- Case 3: Normal Error ---
        // (e.g., "Wrong password", "User not found")
        toast.error(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-16 w-16 text-primary cyber-glow animate-pulse-glow" />
          </div>
          <h1 className="text-4xl font-bold font-mono cyber-glow">LOGIN</h1>
          <p className="text-muted-foreground mt-2">
            Access your secure portal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border cyber-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="username" className="font-mono">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-input border-border focus:border-primary font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border focus:border-primary font-mono"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-semibold shadow-[0_0_20px_rgba(0,245,255,0.3)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4 animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  LOGIN
                </span>
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              No account?{" "}
              <Link to="/register" className="text-secondary hover:text-secondary/80 font-mono font-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;