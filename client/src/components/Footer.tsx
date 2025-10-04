import { Link } from 'wouter';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-gray-800 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 
              className="text-sm font-bold text-white mb-3"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Panel Profits
            </h3>
            <p 
              className="text-xs text-gray-400 leading-relaxed"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Bloomberg Terminal-style financial trading platform for comic books. Trade millions of assets with institutional-grade tools.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 
              className="text-sm font-bold text-white mb-3"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/trading">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Trading Terminal
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/portfolio">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Portfolio
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/analytics">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Analytics
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 
              className="text-sm font-bold text-white mb-3"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/markets">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Market Data
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/research">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Research
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/certification">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Certification
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/education">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Education
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 
              className="text-sm font-bold text-white mb-3"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/risk">
                  <a 
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                  >
                    Risk Disclosure
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              className="text-xs text-gray-500"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              © {currentYear} Panel Profits. All rights reserved.
            </p>
            <p 
              className="text-xs text-gray-500"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Simulated trading platform • Not real financial advice
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
