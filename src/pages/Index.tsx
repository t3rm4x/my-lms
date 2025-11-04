import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, UserPlus, CheckCircle, Database, Terminal, Zap } from "lucide-react";
import { isAuthenticated, getUser, logout } from "@/utils/auth";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getUser();

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
              CYBERSEC<span className="text-secondary">URITY</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Advanced Authentication System with Military-Grade Security
            </p>

            {authenticated && user ? (
              <div className="space-y-4">
                <div className="bg-card border border-border cyber-border rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground mb-2 font-mono">AUTHENTICATED USER</p>
                  <p className="text-lg font-mono text-primary">{user.email}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Status: {user.verified ? (
                      <span className="text-secondary">✓ Verified</span>
                    ) : (
                      <span className="text-destructive">⚠ Unverified</span>
                    )}
                  </p>
                </div>
                
                <div className="flex gap-4 justify-center">
                  {!user.verified && (
                    <Button
                      onClick={() => navigate("/verify")}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-mono font-semibold shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      VERIFY EMAIL
                    </Button>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-white font-mono font-semibold"
                  >
                    <Terminal className="mr-2 h-4 w-4" />
                    LOGOUT
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => navigate("/login")}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-semibold shadow-[0_0_20px_rgba(0,245,255,0.3)] min-w-[200px]"
                >
                  <Lock className="mr-2 h-5 w-5" />
                  LOGIN
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-mono font-semibold shadow-[0_0_20px_rgba(0,255,136,0.3)] min-w-[200px]"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  REGISTER
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold font-mono text-center mb-12 cyber-glow">
          SECURITY FEATURES
        </h2>
        
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
            <h3 className="text-xl font-bold font-mono mb-2">REAL-TIME MONITORING</h3>
            <p className="text-muted-foreground">
              Continuous security monitoring and instant threat detection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
