import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerUser } from "@/services/register";
// Assuming you have this util file
// import { validateEmail, validatePassword } from "@/utils/util"; 
import { Shield, UserPlus } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Re-enabled validation checks
    // if (!validateEmail(email)) {
    //   toast.error("Please enter a valid email address");
    //   return;
    // }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // const passwordValidation = validatePassword(password);
    // if (!passwordValidation.isValid) {
    //   toast.error(passwordValidation.errors[0]);
    //   return;
    // }

    setLoading(true);

    // This function now calls the real API
    const result = await registerUser({ name, email, username, password });

    if (result.success) {
      toast.success(result.message);
      // Since registration doesn't log us in, navigate to login
      navigate("/login"); 
    } else {
      // The backend error message (e.g., "Username already exists") will be shown
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    // This outer container centers everything
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* This container sets the max width */}
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        
        {/* === HEADER === */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-secondary cyber-glow" />
          </div>
          <h1 className="text-4xl font-bold font-mono cyber-glow">CREATE ACCOUNT</h1>
          <p className="text-muted-foreground mt-2">Join our secure platform</p>
        </div>

        {/* === FORM CARD === */}
        {/* This single card contains the form and the login link */}
        <div className="bg-card border border-border cyber-border rounded-lg p-8">
          
          {/* This single form wraps all the inputs */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="name" className="font-mono">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input border-border focus:border-secondary font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="font-mono">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe22"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-input border-border focus:border-secondary font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border focus:border-secondary font-mono"
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
                className="bg-input border-border focus:border-secondary font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-mono">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-input border-border focus:border-secondary font-mono"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-mono font-semibold shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 animate-pulse" />
                  CREATING ACCOUNT...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  REGISTER
                </span>
              )}
            </Button>
          </form>

          {/* === FOOTER LINK === */}
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-secondary hover:text-secondary/80 font-mono font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Register;