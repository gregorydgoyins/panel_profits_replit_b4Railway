import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For testing purposes, use test credentials
      await login(email || 'test@panelprofits.com', password || 'test123');
      
      toast({
        title: "Welcome to Panel Profits",
        description: "Authentication successful. Entering the trading floor...",
      });
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0" />
      
      {/* Grid overlay for trading floor effect */}
      <div 
        className="absolute inset-0 opacity-5 z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 222, 128, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Main auth form */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-20">
        <Card className="w-full max-w-md bg-black/60 backdrop-blur-md border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-header text-white">
              PANEL PROFITS
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access the trading floor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/40 border-white/20 text-white placeholder:text-gray-500"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/40 border-white/20 text-white placeholder:text-gray-500"
                  data-testid="input-password"
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-gray-100"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? "Authenticating..." : "Enter Trading Floor"}
                </Button>
              </div>

              {/* Test credentials hint */}
              <div className="text-center text-xs text-gray-500 pt-2">
                <p>For testing: Use any email/password or leave blank</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}