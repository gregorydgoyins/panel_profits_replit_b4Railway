import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserPlus, AlertTriangle, Eye, EyeOff, Check, X } from 'lucide-react';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
  
  const { signUp, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    return () => {
      // Clear any errors when component unmounts
      clearError();
    };
  }, [isAuthenticated, navigate, clearError]);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback([]);
      return;
    }

    const feedback = [];
    let strength = 0;

    // Length check
    if (password.length >= 8) {
      strength += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('Include at least one uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('Include at least one lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      strength += 1;
    } else {
      feedback.push('Include at least one number');
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('Include at least one special character');
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Moderate';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    
    await signUp(email, password, username, name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-8 shadow-xl max-w-md w-full border border-slate-700/50">
        <div className="text-center mb-8">
          <UserPlus className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Join Panel Profits and start trading</p>
        </div>

        {error && (
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30 mb-6 flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="johndoe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-full bg-slate-700 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{getPasswordStrengthText()}</span>
                </div>
                
                {passwordFeedback.length > 0 && (
                  <ul className="text-xs text-gray-400 space-y-1 mt-2">
                    {passwordFeedback.map((feedback, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <X className="h-3 w-3 text-red-400" />
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full bg-slate-700/50 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  confirmPassword && password !== confirmPassword 
                    ? 'border-red-500' 
                    : confirmPassword 
                      ? 'border-green-500' 
                      : 'border-slate-600/50'
                }`}
                placeholder="••••••••"
              />
              {confirmPassword && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {password === confirmPassword ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <X className="h-5 w-5 text-red-400" />
                  )}
                </div>
              )}
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 bg-slate-700 border-slate-600 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="text-indigo-400 hover:text-indigo-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;