import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, AlertTriangle, Check, Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL
  useEffect(() => {
    // In a real implementation, we would extract the token from the URL
    // For this example, we'll just simulate it
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [location]);
  
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
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we would use the token from the URL
      // For this example, we'll just simulate it
      const { error } = await authService.updatePassword(password);
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-8 shadow-xl max-w-md w-full border border-slate-700/50">
        <div className="text-center mb-8">
          <KeyRound className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-2">Create a new password for your account</p>
        </div>

        {error && (
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30 mb-6 flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30 flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-200 font-medium">Password reset successful!</p>
                <p className="text-xs text-green-300 mt-1">
                  Your password has been updated. You will be redirected to the login page shortly.
                </p>
              </div>
            </div>
            
            <Link
              to="/login"
              className="flex items-center justify-center space-x-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <span>Go to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                New Password
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
                        <li key={index}>{feedback}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-2">
                Confirm New Password
              </label>
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
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || password !== confirmPassword}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
            
            <div className="text-center">
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;