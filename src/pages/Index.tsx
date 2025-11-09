import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, UserPlus, CheckCircle, Database, Terminal, Zap } from "lucide-react";
import { isAuthenticated, getUser, logout } from "@/utils/auth";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getUser(); // This will now use the new, honest User type

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    window.location.reload();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8 animate-slide-up">
            <div className="flex justify-center">
              <Shield className="h-24 w-24 text-primary cyber-glow animate-pulse-glow" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold font-mono cyber-glow">
              CYBER<span className="text-secondary">SECURITY</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Advanced Authentication System with Military-Grade Security
            </p>

            {/* ----- MAIN CHANGE IS HERE ----- */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {authenticated && user ? (
                <div className="bg-card border border-border cyber-border rounded-lg p-6 text-left animate-slide-up">
                  <p className="text-sm text-muted-foreground">Authenticated User:</p>
                  <p className="font-mono text-primary cyber-glow text-xl">
                    {user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {/* NO MORE "unverified"!! Just the email. */}
                    {user.email} 
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    Role: {user.userType}
                  </p>
                  <Button onClick={handleLogout} className="w-full mt-4" variant="destructive">
                    Logout
                  </Button>
                </div>
              ) : (
                // --- ORIGINAL LOGIN/REGISTER BUTTONS ---
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-semibold text-lg py-6 px-8 shadow-[0_0_20px_rgba(0,245,255,0.3)]"
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    LOGIN
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-mono font-semibold text-lg py-6 px-8 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    REGISTER
                  </Button>
                </>
              )}
            </div>
            {/* ----- END OF CHANGE ----- */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-mono cyber-glow">CORE FEATURES</h2>
          <p className="text-muted-foreground mt-2">
            Built with a security-first mindset
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-border cyber-border rounded-lg p-6 hover:shadow-[0_0_30px_rgba(0,245,255,0.2)] transition-all">
            <Database className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold font-mono mb-2">ENCRYPTED STORAGE</h3>
            <p className="text-muted-foreground">
              All data is encrypted with AES-256 encryption at rest and in transit
            </p>
          </div>

          <div className="bg-card border border-border cyber-border rounded-lg p-6 hover:shadow-[0_0_30px_rgba(0,245,255,0.2)] transition-all">
            <Shield className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-bold font-mono mb-2">MULTI-FACTOR AUTH</h3>
            <p className="text-muted-foreground">
              Enhanced security with email verification and secure token-based authentication
            </p>
          </div>

          <div className="bg-card border border-border cyber-border rounded-lg p-6 hover:shadow-[0_0_30px_rgba(0,245,255,0.2)] transition-all">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold font-mono mb-2">LIGHTNING FAST</h3>
            <p className="text-muted-foreground">
              Serverless architecture ensures minimal latency and maximum scalability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;