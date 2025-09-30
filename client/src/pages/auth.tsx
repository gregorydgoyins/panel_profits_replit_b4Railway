import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function AuthPage() {
  // Replit auth uses OIDC - redirect to login endpoint
  const handleLogin = () => {
    window.location.href = '/api/login';
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
            <div className="space-y-4">
              <Button 
                onClick={handleLogin}
                className="w-full bg-white text-black hover:bg-gray-100"
                data-testid="button-login"
              >
                Sign In with Replit
              </Button>

              {/* Information */}
              <div className="text-center text-xs text-gray-500 pt-2">
                <p>Secure authentication via Replit OIDC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}