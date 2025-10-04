import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';
import { useLocation } from 'wouter';

const COMIC_PANELS = [
  {
    id: 1,
    title: "THE MARKET NEVER SLEEPS",
    text: "In a world where comic books are currency and fortunes rise and fall with the stroke of a pen...",
    caption: "NEW YORK CITY - PRESENT DAY",
    bgGradient: "from-black via-gray-900 to-black"
  },
  {
    id: 2,
    title: "WHO WATCHES THE WATCHMEN?",
    text: "Seven Houses control the flow of capital. Each with their own philosophy. Their own methods. Their own vision of profit.",
    caption: "THE SEVEN HOUSES OF PANEL PROFITS",
    bgGradient: "from-gray-900 via-black to-gray-900"
  },
  {
    id: 3,
    title: "EVERY CHOICE HAS A PRICE",
    text: "Your decisions will define you. Your morality will be tested. Your profits will be measured.",
    caption: "BUT WHICH HOUSE WILL CLAIM YOU?",
    bgGradient: "from-black via-indigo-950 to-black"
  },
  {
    id: 4,
    title: "THE ASSESSMENT BEGINS",
    text: "Before you can trade, we need to know who you are. What drives you. What you're willing to sacrifice for success.",
    caption: "ARE YOU READY?",
    bgGradient: "from-indigo-950 via-black to-black"
  }
];

export default function ComicIntro() {
  const [currentPanel, setCurrentPanel] = useState(0);
  const [, setLocation] = useLocation();

  const handleNext = () => {
    if (currentPanel < COMIC_PANELS.length - 1) {
      setCurrentPanel(currentPanel + 1);
    } else {
      // Last panel - go to Entry Test
      setLocation('/entry-test');
    }
  };

  const handlePrevious = () => {
    if (currentPanel > 0) {
      setCurrentPanel(currentPanel - 1);
    }
  };

  const handleSkip = () => {
    setLocation('/entry-test');
  };

  const panel = COMIC_PANELS[currentPanel];

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${panel.bgGradient} transition-all duration-1000 ease-in-out`}
      />

      {/* Noir grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 222, 128, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Skip button - top right */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-400 hover:text-white"
          data-testid="button-skip-intro"
        >
          <SkipForward className="mr-2 h-4 w-4" />
          Skip to Test
        </Button>
      </div>

      {/* Main panel content */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-20">
        <div className="max-w-4xl w-full">
          {/* Panel border - comic book style */}
          <div className="relative p-1 bg-gradient-to-br from-green-500/20 via-transparent to-green-500/20">
            <div className="bg-black/80 backdrop-blur-md p-12 border border-green-500/30">
              {/* Caption */}
              <div className="text-center mb-8">
                <p 
                  className="text-green-500/70 text-sm tracking-widest uppercase font-mono"
                  data-testid="text-panel-caption"
                >
                  {panel.caption}
                </p>
              </div>

              {/* Title */}
              <h1 
                className="text-5xl md:text-6xl font-bold text-white text-center mb-8 tracking-tight"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                data-testid="text-panel-title"
              >
                {panel.title}
              </h1>

              {/* Body text */}
              <p 
                className="text-xl text-gray-300 text-center max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                data-testid="text-panel-body"
              >
                {panel.text}
              </p>

              {/* Panel indicator dots */}
              <div className="flex justify-center gap-2 mt-12">
                {COMIC_PANELS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentPanel 
                        ? 'bg-green-500 w-8' 
                        : 'bg-gray-600'
                    }`}
                    data-testid={`indicator-panel-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation controls - bottom */}
      <div className="relative z-20 p-6 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentPanel === 0}
          className="text-white disabled:opacity-30"
          data-testid="button-previous-panel"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Previous
        </Button>

        <div className="text-center">
          <p className="text-gray-500 text-sm font-mono">
            Panel {currentPanel + 1} of {COMIC_PANELS.length}
          </p>
        </div>

        <Button
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-600 text-black font-bold"
          data-testid="button-next-panel"
        >
          {currentPanel === COMIC_PANELS.length - 1 ? 'Begin Test' : 'Next'}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
