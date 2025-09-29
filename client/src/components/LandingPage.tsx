import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skull, DollarSign, TrendingDown, AlertTriangle, Brain, Eye, Clock, Trophy } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Hero Section with torn edge and textures */}
      <div className="relative overflow-hidden torn-edge-bottom">
        <div className="absolute inset-0 crosshatch" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="mb-6">
              <Skull className="h-16 w-16 text-destructive mx-auto mb-4" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-6 ink-bleed-heavy uppercase tracking-wider" data-testid="heading-hero-title">
              Panel Profits
            </h1>
            <p className="text-2xl font-semibold text-destructive mb-4 uppercase ink-bleed">Every Trade Has A Victim</p>
            <p className="text-xl text-white mb-8 max-w-4xl mx-auto font-mono" data-testid="text-hero-description">
              The market doesn't care about your dreams. Every profit you make is someone else's loss. Every portfolio built on corpses. Welcome to the real game where morality is a luxury and survival is the only currency.
            </p>
            <Button 
              size="lg" 
              className="bg-destructive hover:bg-destructive/80 text-white px-8 py-4 text-lg font-semibold uppercase shadow-noir-lg border-2 border-white"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
            >
              <Skull className="mr-2 h-5 w-5" />
              EMBRACE THE VOID
            </Button>
          </div>
        </div>
      </div>

      {/* Seven Sins of Trading Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 uppercase ink-bleed" data-testid="heading-houses">
            The Seven Sins of Trading
          </h2>
          <p className="text-destructive text-lg uppercase font-mono" data-testid="text-houses-description">
            Choose your damnation. Every path leads to the same end.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* GREED */}
          <Card className="bg-black border-2 border-white noir-panel crosshatch shadow-noir-md" data-testid="card-sin-greed">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive uppercase">
                <DollarSign className="mr-2 h-5 w-5 text-destructive" />
                GREED
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-mono text-sm">
                <span className="text-destructive font-bold">The Comedian's Portfolio</span><br/>
                Profit from tragedy. Every disaster is an opportunity. War is good for business. Death pays dividends.
              </p>
            </CardContent>
          </Card>

          {/* HUBRIS */}
          <Card className="bg-black border-2 border-white noir-panel crosshatch shadow-noir-md" data-testid="card-sin-hubris">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive uppercase">
                <Brain className="mr-2 h-5 w-5 text-destructive" />
                HUBRIS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-mono text-sm">
                <span className="text-destructive font-bold">Ozymandias's Gambit</span><br/>
                You think you control the markets. You see patterns where there's only chaos. Your models will fail.
              </p>
            </CardContent>
          </Card>

          {/* WRATH */}
          <Card className="bg-black border-2 border-white noir-panel crosshatch shadow-noir-md" data-testid="card-sin-wrath">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive uppercase">
                <TrendingDown className="mr-2 h-5 w-5 text-destructive" />
                WRATH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-mono text-sm">
                <span className="text-destructive font-bold">Rorschach's Vengeance</span><br/>
                Destroy the shorts. Burn the bears. Leave nothing but ash. The market is your battlefield.
              </p>
            </CardContent>
          </Card>

          {/* ENVY */}
          <Card className="bg-black border-2 border-white noir-panel crosshatch shadow-noir-md" data-testid="card-sin-envy">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive uppercase">
                <Eye className="mr-2 h-5 w-5 text-destructive" />
                ENVY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-mono text-sm">
                <span className="text-destructive font-bold">Silk Spectre's Shadow</span><br/>
                Copy the winners. Follow the whales. You'll always be one step behind, drowning in their wake.
              </p>
            </CardContent>
          </Card>

          {/* GLUTTONY */}
          <Card className="bg-black border-2 border-white noir-panel crosshatch shadow-noir-md" data-testid="card-sin-gluttony">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive uppercase">
                <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                GLUTTONY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-mono text-sm">
                <span className="text-destructive font-bold">Dr. Manhattan's Void</span><br/>
                Consume everything. Leverage to the hilt. The appetite that devours portfolios whole.
              </p>
            </CardContent>
          </Card>

          {/* SLOTH */}
          <Card className="bg-black border-2 border-white noir-panel crosshatch shadow-noir-md" data-testid="card-sin-sloth">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive uppercase">
                <Clock className="mr-2 h-5 w-5 text-destructive" />
                SLOTH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-mono text-sm">
                <span className="text-destructive font-bold">Nite Owl's Regret</span><br/>
                The trades you didn't make. The opportunities missed. Time decays everything, especially hope.
              </p>
            </CardContent>
          </Card>

          {/* PRIDE */}
          <Card className="bg-black border-2 border-white noir-panel crosshatch shadow-noir-md" data-testid="card-sin-pride">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive uppercase">
                <Trophy className="mr-2 h-5 w-5 text-destructive" />
                PRIDE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-mono text-sm">
                <span className="text-destructive font-bold">The Minutemen's Fall</span><br/>
                Yesterday's wins mean nothing. Past performance is a lie. Your ego will be your undoing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action with ink splatter */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center relative ink-splatter-1">
        <h3 className="text-4xl font-bold text-white mb-6 uppercase ink-bleed-heavy" data-testid="heading-cta">
          THE END IS WRITTEN
        </h3>
        <p className="text-xl text-white mb-8 font-mono" data-testid="text-cta-description">
          There are no heroes in this market. No redemption. No second chances. Just winners, losers, and the void that awaits us all. Choose your sin and face your damnation.
        </p>
        <Button 
          size="lg"
          className="bg-black border-4 border-destructive hover:bg-destructive text-white px-8 py-4 text-lg font-semibold uppercase shadow-noir-xl"
          onClick={() => window.location.href = "/api/login"}
          data-testid="button-cta-login"
        >
          <Skull className="mr-2 h-5 w-5" />
          ACCEPT YOUR DAMNATION
        </Button>
      </div>

      {/* Additional texture overlays */}
      <div className="fixed inset-0 pointer-events-none scratched opacity-20" />
      <div className="fixed inset-0 pointer-events-none halftone opacity-10" />
    </div>
  );
}