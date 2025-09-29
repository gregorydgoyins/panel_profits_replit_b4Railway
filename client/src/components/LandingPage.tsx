import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Swords, Flame, BookOpen, Zap, Shield, Users } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="mb-6">
              <Crown className="h-16 w-16 text-amber-400 mx-auto mb-4" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent" data-testid="heading-hero-title">
              Panel Profits
            </h1>
            <p className="text-2xl font-semibold text-amber-200 mb-4">The Mythological Financial RPG</p>
            <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto" data-testid="text-hero-description">
              Choose your House. Master your specialization. Trade comic assets with mystical bonuses, karma-based modifiers, and AI-powered intelligence. This isn't just trading—it's legendary.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
            >
              <Crown className="mr-2 h-5 w-5" />
              Enter the Realm
            </Button>
          </div>
        </div>
      </div>

      {/* Seven Houses Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4" data-testid="heading-houses">
            Choose Your Mythological House
          </h2>
          <p className="text-amber-100 text-lg" data-testid="text-houses-description">
            Each House grants unique trading specializations and mystical bonuses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border-red-600/50 hover-elevate" data-testid="card-house-heroes">
            <CardHeader>
              <CardTitle className="flex items-center text-red-200">
                <Shield className="mr-2 h-5 w-5 text-red-400" />
                House of Heroes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-100">
                Masters of character options and futures. +15% success on hero asset trades. Specialize in protagonist derivatives and superhero market predictions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-600/50 hover-elevate" data-testid="card-house-wisdom">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-200">
                <BookOpen className="mr-2 h-5 w-5 text-blue-400" />
                House of Wisdom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100">
                Scholars of creator bonds and intellectual property. Enhanced AI insights. Excel at long-term creator investments and franchise valuation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-purple-600/50 hover-elevate" data-testid="card-house-power">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-200">
                <Crown className="mr-2 h-5 w-5 text-purple-400" />
                House of Power
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">
                Rulers of publisher stocks and franchise NFTs. Lower trading fees on high-value assets. Command institutional-grade market access.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-600/50 hover-elevate" data-testid="card-house-mystery">
            <CardHeader>
              <CardTitle className="flex items-center text-green-200">
                <Zap className="mr-2 h-5 w-5 text-green-400" />
                House of Mystery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100">
                Seers of rare issue derivatives and speculation tokens. Early access to exclusive assets. Predict market movements with mystical accuracy.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border-amber-600/50 hover-elevate" data-testid="card-house-elements">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-200">
                <Flame className="mr-2 h-5 w-5 text-amber-400" />
                House of Elements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-100">
                Wielders of cross-universe asset baskets. Elemental bonuses stack across different comic universes. Master complex portfolio strategies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/40 to-slate-900/40 border-gray-600/50 hover-elevate" data-testid="card-house-time">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-200">
                <Users className="mr-2 h-5 w-5 text-gray-400" />
                House of Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-100">
                Guardians of historical price prediction markets. Time-based karma multipliers. Excel at vintage comic appreciation and market timing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h3 className="text-4xl font-bold text-white mb-6" data-testid="heading-cta">
          Your Legend Awaits
        </h3>
        <p className="text-xl text-amber-100 mb-8" data-testid="text-cta-description">
          Join the elite traders wielding mystical powers in the ultimate comic asset battlefield. Build your karma, master your House, and become a legend.
        </p>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
          onClick={() => window.location.href = "/api/login"}
          data-testid="button-cta-login"
        >
          <Swords className="mr-2 h-5 w-5" />
          Begin Your Quest
        </Button>
      </div>
    </div>
  );
}