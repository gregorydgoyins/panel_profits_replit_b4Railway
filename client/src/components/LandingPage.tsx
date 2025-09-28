import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, Users } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6" data-testid="heading-hero-title">
              Welcome to Panel Profits
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto" data-testid="text-hero-description">
              The ultimate virtual trading platform for comic book assets. Trade characters, key issues, creators, and publishers with real-time market dynamics and AI-powered insights.
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
            >
              <Shield className="mr-2 h-5 w-5" />
              Sign In to Start Trading
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4" data-testid="heading-features">
            Why Choose Panel Profits?
          </h2>
          <p className="text-blue-100 text-lg" data-testid="text-features-description">
            Experience the future of virtual trading with our cutting-edge platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-black/40 border-blue-800/50" data-testid="card-feature-trading">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-100">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                Real-Time Trading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200">
                Trade comic assets with live market data, technical indicators, and professional-grade charting tools.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-800/50" data-testid="card-feature-ai">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-100">
                <Zap className="mr-2 h-5 w-5 text-blue-400" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200">
                Get intelligent market analysis, sentiment tracking, and personalized recommendations from our AI system.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-800/50" data-testid="card-feature-portfolio">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-100">
                <Shield className="mr-2 h-5 w-5 text-blue-400" />
                Portfolio Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200">
                Track your holdings, monitor performance, and optimize your comic asset portfolio with advanced analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-800/50" data-testid="card-feature-community">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-100">
                <Users className="mr-2 h-5 w-5 text-blue-400" />
                Community Trading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200">
                Join competitions, compare strategies, and learn from other traders in the Panel Profits community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h3 className="text-3xl font-bold text-white mb-6" data-testid="heading-cta">
          Ready to Start Your Trading Journey?
        </h3>
        <p className="text-xl text-blue-100 mb-8" data-testid="text-cta-description">
          Join thousands of traders who are already profiting from the comic book market
        </p>
        <Button 
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          onClick={() => window.location.href = "/api/login"}
          data-testid="button-cta-login"
        >
          <Shield className="mr-2 h-5 w-5" />
          Get Started Now
        </Button>
      </div>
    </div>
  );
}