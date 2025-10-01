import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Link } from "wouter";

export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [videoSource, setVideoSource] = useState("/videos/daytime-video.mp4");

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("light", savedTheme === "light");
    }
    
    // Set video based on time of day
    const updateVideoByTime = () => {
      const hour = new Date().getHours();
      // Daytime: 6 AM to 6 PM (6-18), Nighttime: 6 PM to 6 AM
      const isDaytime = hour >= 6 && hour < 18;
      setVideoSource(isDaytime ? "/videos/daytime-video.mp4" : "/videos/nighttime-video.mp4");
    };
    
    // Set initial video
    updateVideoByTime();
    
    // Update video every minute to catch transitions
    const interval = setInterval(updateVideoByTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Full-frame looping video background - automatically switches between day/night */}
      <video
        key={videoSource} // Force reload when source changes
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay for text readability - lightened for brighter video */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60 z-10" />

      {/* Minimal header with theme toggle */}
      <header className="absolute top-0 right-0 p-6 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10 backdrop-blur-md bg-black/30 hover:bg-black/50"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-white" />
          ) : (
            <Moon className="h-5 w-5 text-white" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      {/* Main content - centered login area with lighter overlay (reduced from 60% to 40%) */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-20">
        <div className="w-full max-w-md backdrop-blur-md bg-black/40 p-12 rounded-lg border border-white/10">
          {/* Logo and tagline with stronger text */}
          <div className="text-center mb-12">
            <h1 
              className="text-5xl font-header font-bold tracking-tight mb-4 text-white drop-shadow-2xl"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              data-testid="text-app-title"
            >
              PANEL PROFITS
            </h1>
            <p 
              className="text-gray-200 text-lg"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="text-app-tagline"
            >
              Investment-Grade Comic Art Trading
            </p>
          </div>

          {/* Entry button */}
          <div className="space-y-4">
            <Link href="/auth">
              <Button 
                className="w-full h-12 text-base tracking-wider uppercase bg-white text-black hover:bg-gray-100"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                variant="default"
                size="lg"
                data-testid="button-begin-test"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-base font-bold">Help Wanted</span>
                  <span className="text-xs font-normal">Closers Only</span>
                </div>
              </Button>
            </Link>

            {/* Subtle divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span 
                  className="px-4 bg-black/40 text-gray-300 backdrop-blur-sm"
                  style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                >
                  Members
                </span>
              </div>
            </div>

            {/* Existing member login */}
            <Link href="/auth">
              <Button 
                className="w-full h-12 text-base tracking-wider uppercase border-white/50 text-white hover:bg-white hover:text-black shadow-xl backdrop-blur-sm"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                variant="outline"
                size="lg"
                data-testid="button-member-login"
              >
                Member Login
              </Button>
            </Link>
          </div>

          {/* Minimal footer info */}
          <div className="mt-16 text-center">
            <p 
              className="text-xs text-gray-300"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Professional Trading Platform
            </p>
            <p 
              className="text-xs text-gray-300 mt-1"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Desktop Experience Recommended • 1920x1080+
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}